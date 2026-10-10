// Run against a local server: node scripts/check-auth-flow.mjs
// Creates one unique test account, verifies the auth lifecycle, then deletes it.
import "dotenv/config";
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import pg from "pg";

const origin = process.env.AUTH_CHECK_ORIGIN || "http://localhost:3000";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname), "Use a local server for these checks.");
const email = `redline-auth-check-${randomUUID()}@example.com`;
const password = randomBytes(24).toString("base64url");
const database = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
const cookies = new Map();
let ownsTestIdentity = false;

function cookieHeader() {
  return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
}

async function request(path, body, cookie = cookieHeader()) {
  const response = await fetch(`${origin}/api/auth/${path}`, {
    method: body ? "POST" : "GET",
    headers: { origin, ...(body ? { "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(20000),
  });
  for (const header of response.headers.getSetCookie()) {
    const entry = header.split(";", 1)[0];
    const separator = entry.indexOf("=");
    const name = entry.slice(0, separator);
    const value = entry.slice(separator + 1);
    if (value) cookies.set(name, value);
    else cookies.delete(name);
  }
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error(`${path} returned HTTP ${response.status} without a JSON response.`); }
  return { response, data };
}

try {
  // Establish cleanup access before creating anything.
  await database.connect();
  const existing = await database.query('SELECT id FROM "user" WHERE email = $1', [email]);
  assert.equal(existing.rowCount, 0, "Test identity unexpectedly exists; no data changed.");
  ownsTestIdentity = true;

  let result = await request("sign-up/email", { name: "Redline Auth Check", email, password: "short" });
  assert.equal(result.data.code, "PASSWORD_TOO_SHORT", "Server must reject short signup passwords.");
  console.log("PASS: server password validation");

  result = await request("sign-up/email", { name: "Redline Auth Check", email, password, callbackURL: "/dashboard" });
  assert.ok(result.response.ok, `Signup failed (HTTP ${result.response.status}).`);
  assert.equal(result.data.user?.email, email);
  assert.ok(cookieHeader(), "Signup did not set a session cookie.");
  const userId = result.data.user.id;
  result = await request("get-session");
  assert.equal(result.data?.user?.id, userId, "Signup session is unavailable.");
  console.log("PASS: signup creates an authenticated session");

  const account = await database.query('SELECT password FROM "account" WHERE "userId" = $1 AND "providerId" = $2', [userId, "credential"]);
  assert.equal(account.rowCount, 1);
  assert.ok(account.rows[0].password && account.rows[0].password !== password, "Password must not be stored as plaintext.");
  console.log("PASS: credential password is stored as a hash");

  result = await request("sign-up/email", { name: "Redline Auth Check", email, password });
  assert.equal(result.response.ok, false, "Duplicate signup should fail.");
  console.log("PASS: duplicate signup is rejected");

  const signupCookie = cookieHeader();
  result = await request("sign-out", {});
  assert.ok(result.response.ok, "Signup session signout failed.");
  assert.equal((await request("get-session", undefined, signupCookie)).data, null, "Signed-out session was still valid.");

  result = await request("sign-in/email", { email, password: `${password}-wrong` }, "");
  assert.equal(result.data.code, "INVALID_EMAIL_OR_PASSWORD", "Incorrect password must fail.");
  console.log("PASS: incorrect password is rejected");

  result = await request("sign-in/email", { email, password, rememberMe: false, callbackURL: "/dashboard" }, "");
  assert.ok(result.response.ok, `Login failed (HTTP ${result.response.status}).`);
  assert.equal((await request("get-session")).data?.user?.id, userId);
  console.log("PASS: credentials login restores the correct session");

  const loginCookie = cookieHeader();
  assert.ok((await request("sign-out", {})).response.ok);
  assert.equal((await request("get-session")).data, null);
  assert.equal((await request("get-session", undefined, loginCookie)).data, null, "Old cookie must be invalid after signout.");
  console.log("PASS: signout clears the cookie and revokes the server session");
} catch (error) {
  // Avoid printing credentials or auth response bodies.
  console.error(`Auth check failed: ${error.code || error.message}`);
  process.exitCode = 1;
} finally {
  try {
    if (ownsTestIdentity) {
      // Only the generated test identity can be removed. Relations cascade.
      await database.query('DELETE FROM "user" WHERE email = $1', [email]);
      console.log("Temporary test account cleaned up.");
    }
  } catch {
    console.error("Temporary test account cleanup failed; check the generated test identity.");
    process.exitCode = 1;
  } finally {
    await database.end();
  }
}
