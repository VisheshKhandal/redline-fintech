// node --experimental-strip-types scripts/reconcile-billing.mjs
// Read-only against Polar Sandbox; persists authoritative state to Neon.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { createPolarCore } from "@polar-sh/sdk/2026-10";
import { getStateExternalCustomers } from "@polar-sh/sdk/2026-10/services/customers";
import { iterListSubscriptions } from "@polar-sh/sdk/2026-10/services/subscriptions";
import { createBillingService, hasProAccess } from "../src/lib/billing-core.mjs";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const polar = createPolarCore({ accessToken: process.env.POLAR_ACCESS_TOKEN, environment: "sandbox" });
const service = createBillingService({ db,
  getCustomer: (id) => getStateExternalCustomers(polar)(id, { timeout: 15 }),
  listSubscriptions: (id) => iterListSubscriptions(polar)({ external_customer_id: id, limit: 100 }, { timeout: 15 }),
});
try {
  const users = await db.user.findMany({ select: { id: true } });
  let proUsers = 0;
  for (const user of users) {
    const first = await service.reconcileUser(user.id);
    const second = await service.reconcileUser(user.id);
    if (first.length !== second.length) throw new Error("Reconciliation must be idempotent");
    if (second.some((s) => hasProAccess(s))) proUsers++;
  }
  console.log(JSON.stringify({ sandboxOnly: true, usersReconciled: users.length, proUsers,
    subscriptionsSaved: await db.billingSubscription.count(), duplicateReconciliationSafe: true }));
} finally { await db.$disconnect(); }
