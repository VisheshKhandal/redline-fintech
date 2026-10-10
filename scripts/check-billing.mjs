import assert from "node:assert/strict";
import { createBillingService, hasProAccess, REDLINE_PRO_PRODUCT_ID } from "../src/lib/billing-core.mjs";
const now = new Date("2026-10-10T00:00:00Z");
const active = { productId: REDLINE_PRO_PRODUCT_ID, status: "active", entitled: true, currentPeriodEnd: "2026-11-10T00:00:00Z", endedAt: null };
assert.equal(hasProAccess(active, now), true);
assert.equal(hasProAccess({ ...active, cancelAtPeriodEnd: true, canceledAt: now }, now), true);
for (const override of [{ productId: "other" }, { entitled: false }, { status: "canceled" }, { status: "revoked" }, { status: "unpaid" }, { status: "unknown" }, { endedAt: now }, { currentPeriodEnd: now }, { currentPeriodEnd: null }]) {
  assert.equal(hasProAccess({ ...active, ...override }, now), false);
}
assert.equal(hasProAccess({ ...active, status: "past_due" }, now), true);
assert.equal(hasProAccess({ ...active, status: "past_due", entitled: false }, now), false);
console.log("PASS: exact product, expiry, cancellation, revocation, unknown status and authoritative past-due grace");

const rows = new Map();
let status = "active", entitled = true;
const tx = {
  $executeRaw: async () => {},
  user: { findUnique: async () => ({ id: "user-1" }) },
  billingSubscription: {
    updateMany: async () => { for (const row of rows.values()) row.entitled = false; },
    findUnique: async ({ where }) => rows.get(where.polarSubscriptionId),
    upsert: async ({ where, create, update }) => rows.set(where.polarSubscriptionId, rows.has(where.polarSubscriptionId) ? { ...rows.get(where.polarSubscriptionId), ...update } : create),
    findMany: async () => [...rows.values()],
  },
};
const service = createBillingService({ db: { $transaction: (fn) => fn(tx) },
  getCustomer: async () => ({ id: "customer-1", external_id: "user-1", active_subscriptions: entitled ? [{ id: "subscription-1" }] : [] }),
  listSubscriptions: async function* () { yield { id: "subscription-1", customer_id: "customer-1", customer: { external_id: "user-1" }, product_id: REDLINE_PRO_PRODUCT_ID, status, current_period_end: active.currentPeriodEnd, cancel_at_period_end: false, ended_at: status === "canceled" ? now.toISOString() : null }; },
});
await service.reconcileUser("user-1"); await service.reconcileUser("user-1");
assert.equal(rows.size, 1); assert.equal(hasProAccess([...rows.values()][0], now), true);
status = "canceled"; entitled = false;
await service.reconcileUser("user-1");
assert.equal(hasProAccess([...rows.values()][0], now), false);
await service.reconcileUser("user-1"); // An old active webhook triggers the same current-state reconciliation.
assert.equal(hasProAccess([...rows.values()][0], now), false);
console.log("PASS: duplicate deliveries, persistent upsert, and old activation delivery after revocation");
console.log("PENDING: real Polar webhook delivery verification after signing secret setup");
