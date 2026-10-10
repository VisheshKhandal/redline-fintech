// Run against a local production server, e.g. SITE_CHECK_ORIGIN=http://localhost:3100.
import assert from "node:assert/strict";
const origin = process.env.SITE_CHECK_ORIGIN || "http://localhost:3100";
const canonicalOrigin = "https://redline-fintech.vercel.app";
const get = async (path) => {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(15000) });
  assert.ok(response.ok, `${path} returned HTTP ${response.status}`);
  return response;
};
for (const path of ["/login", "/signup"]) {
  const html = await (await get(path)).text();
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`href="${canonicalOrigin}${path}"`));
  assert.ok(html.includes(`${canonicalOrigin}/social/redline-og.png`));
  assert.ok(html.includes('content="summary_large_image"'));
  assert.ok(html.includes('href="/favicon.svg"'));
  assert.ok(html.includes('href="/apple-touch-icon.png"'));
  assert.ok(html.includes('SoftwareApplication'));
  assert.ok(!html.includes('aggregateRating'));
}
for (const path of ["/dashboard", "/dashboard/markets", "/dashboard/watchlist", "/dashboard/portfolio", "/dashboard/market-briefing", "/dashboard/upgrade", "/dashboard/billing"]) {
  const html = await (await get(path)).text();
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.ok(!html.includes('rel="canonical"'));
}
const manifest = await (await get("/manifest.webmanifest")).json();
assert.equal(manifest.display, "standalone");
assert.equal(manifest.scope, "/");
assert.equal(manifest.start_url, "/login");
for (const icon of manifest.icons) {
  const response = await get(icon.src);
  const data = Buffer.from(await response.arrayBuffer());
  assert.equal(data.subarray(1, 4).toString(), "PNG");
  const [width, height] = icon.sizes.split("x").map(Number);
  assert.equal(data.readUInt32BE(16), width);
  assert.equal(data.readUInt32BE(20), height);
}
assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
const og = Buffer.from(await (await get("/social/redline-og.png")).arrayBuffer());
assert.equal(og.readUInt32BE(16), 1200);
assert.equal(og.readUInt32BE(20), 630);
const sitemap = await (await get("/sitemap.xml")).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, 2);
assert.ok(!sitemap.includes("/dashboard") && !sitemap.includes("/api/"));
assert.ok((await (await get("/robots.txt")).text()).includes(`${canonicalOrigin}/sitemap.xml`));
assert.match((await get("/sw.js")).headers.get("cache-control"), /no-store/);
assert.match((await get("/offline.html")).headers.get("x-robots-tag"), /noindex/);
assert.match((await get("/api/billing/plan")).headers.get("cache-control"), /no-store/);
console.log("PASS: public canonicals/social/JSON-LD, dashboard noindex, icons/OG dimensions, manifest, sitemap, robots and cache headers");
