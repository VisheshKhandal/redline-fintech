// Sandbox integration checks. Creates temporary local sessions and a Free user,
// then removes them. Never changes a Polar subscription or submits a payment.
import "dotenv/config";
import assert from "node:assert/strict";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { createPolarCore } from "@polar-sh/sdk/2026-10";
import { getSubscriptions } from "@polar-sh/sdk/2026-10/services/subscriptions";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const origin = "http://localhost:3100";
const secret = process.env.POLAR_WEBHOOK_SECRET;
const sessionIds = [];
let freeUserId;
let server;

async function cookie(userId) {
  const token = randomBytes(32).toString("base64url"), id = randomUUID();
  await db.session.create({ data: { id, token, userId, expiresAt: new Date(Date.now() + 600000) } });
  sessionIds.push(id);
  const signature = createHmac("sha256", process.env.BETTER_AUTH_SECRET).update(token).digest("base64");
  return `better-auth.session_token=${encodeURIComponent(`${token}.${signature}`)}`;
}
async function request(path, cookieValue = "", options = {}) {
  return fetch(`${origin}${path}`, { ...options,
    headers: { origin, cookie: cookieValue, ...options.headers }, signal: AbortSignal.timeout(60000), redirect: "manual" });
}
try {
  const paid = await db.billingSubscription.findFirst({ where: { entitled: true } });
  assert.ok(paid, "Run reconcile-billing.mjs first; an existing paid Sandbox subscription is required");
  const free = await db.user.create({ data: { id: randomUUID(), name: "Billing verification", email: `billing-check-${randomUUID()}@example.com` } });
  freeUserId = free.id;
  const paidCookie = await cookie(paid.userId), freeCookie = await cookie(free.id);
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", "3100"], {
    env: { ...process.env, BETTER_AUTH_URL: origin }, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.resume();
  server.stderr.resume();
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error("Test server exited before readiness");
    try { if ((await request("/login")).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.equal((await request("/api/pro/analytics")).status, 401);
  assert.equal((await request("/api/pro/analytics", freeCookie)).status, 403);
  assert.equal((await request("/api/pro/analytics", paidCookie)).status, 200);
  for (let i = 0; i < 2; i++) {
    const plan = await (await request("/api/billing/plan", paidCookie)).json();
    assert.equal(plan.plan, "pro");
  }
  const secondPaidSession = await cookie(paid.userId);
  assert.equal((await (await request("/api/billing/plan", secondPaidSession)).json()).plan, "pro");
  console.log("PASS: anonymous 401, Free 403, paid 200; repeat authenticated plan reads stay Pro");
  const symbols = ["NVDA", "AAPL", "MSFT", "TSLA", "AMZN", "META"];
  assert.equal((await request("/api/watchlist", freeCookie, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ symbols }) })).status, 403);
  console.log("PASS: server rejects Free watchlist limit bypass");
  if (!secret) {
    console.log("PENDING: real webhook delivery/signature integration test; configure POLAR_WEBHOOK_SECRET from Polar Sandbox first");
  } else {
    const countBefore = await db.billingSubscription.count();
    const polar = createPolarCore({ accessToken: process.env.POLAR_ACCESS_TOKEN, environment: "sandbox" });
    const subscription = await getSubscriptions(polar)(paid.polarSubscriptionId, { timeout: 15 });
    const payload = JSON.stringify({ type: "subscription.active", timestamp: new Date().toISOString(), data: subscription });
    const id = randomUUID(), timestamp = String(Math.floor(Date.now() / 1000));
    const signature = createHmac("sha256", secret).update(id + "." + timestamp + "." + payload).digest("base64");
    const headers = { "content-type": "application/json", "webhook-id": id, "webhook-timestamp": timestamp, "webhook-signature": "v1," + signature };
    for (let i = 0; i < 2; i++) {
      const response = await fetch(origin + "/api/auth/polar/webhooks", { method: "POST", headers, body: payload, signal: AbortSignal.timeout(60000) });
      assert.equal(response.status, 200, "Verified webhook must be accepted");
    }
    assert.equal(await db.billingSubscription.count(), countBefore);
    console.log("PASS: signed plugin callback and duplicate delivery with configured real secret");
  }
  const portal = await request("/api/auth/customer/portal", paidCookie, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ redirect: false }) });
  assert.equal(portal.status, 200);
  const portalData = await portal.json();
  assert.ok(new URL(portalData.url).hostname.endsWith("polar.sh"));
  console.log("PASS: authenticated Sandbox customer portal returns hosted management URL");
  assert.equal((await request("/dashboard/billing", paidCookie)).status, 200);
  const checkout = await request("/api/auth/checkout", paidCookie, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: "redline-pro" }) });
  assert.equal(checkout.status, 200);
  const checkoutData = await checkout.json();
  assert.equal(new URL(checkoutData.url).hostname, "sandbox.polar.sh");
  console.log("PASS: existing authenticated checkout returns Sandbox URL; no payment submitted");
  assert.equal((await request("/api/auth/checkout", "", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: "redline-pro" }) })).status, 401);
  console.log("PASS: billing route renders and checkout still requires authentication");
} catch (error) {
  // Print no server logs: OAuth tokens, session cookies and personal details must stay private.
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (server) server.kill();
  if (sessionIds.length) await db.session.deleteMany({ where: { id: { in: sessionIds } } });
  if (freeUserId) await db.user.delete({ where: { id: freeUserId } });
  await db.$disconnect();
}
