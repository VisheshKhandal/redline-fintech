import "server-only";
import { headers } from "next/headers";
import { getStateExternalCustomers } from "@polar-sh/sdk/2026-10/services/customers";
import { getSubscriptions, iterListSubscriptions } from "@polar-sh/sdk/2026-10/services/subscriptions";
import { db } from "./db";
import { polarClient } from "./polar";
import { createBillingService, hasProAccess } from "./billing-core.mjs";

export const billingService = createBillingService({
  db,
  getCustomer: (id) => getStateExternalCustomers(polarClient)(id, { timeout: 15 }),
  listSubscriptions: (id) => iterListSubscriptions(polarClient)({ external_customer_id: id, limit: 100 }, { timeout: 15 }),
});

export async function reconcileBillingEvent(event) {
  // Signed event is a trigger only; current API state supplies the owner and status.
  const userId = event.type === "customer.state_changed"
    ? event.data.external_id
    : (await getSubscriptions(polarClient)(event.data.id, { timeout: 15 })).customer.external_id;
  if (userId) await billingService.reconcileUser(userId);
}

export async function getUserPlan() {
  // Dynamic import avoids the auth -> webhook -> billing -> auth import cycle.
  const { auth } = await import("./auth");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { plan: "free", authenticated: false, subscription: null };
  const subscriptions = await billingService.reconcileUser(session.user.id);
  const subscription = subscriptions.find((s) => hasProAccess(s)) || subscriptions[0];
  return {
    authenticated: true, userId: session.user.id, plan: hasProAccess(subscription) ? "pro" : "free",
    subscription: subscription ? {
      status: subscription.status, currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    } : null,
  };
}

export async function requirePro() {
  const result = await getUserPlan();
  if (!result.authenticated) throw Object.assign(new Error("Sign in required"), { status: 401 });
  if (result.plan !== "pro") throw Object.assign(new Error("Redline Pro required"), { status: 403 });
  return result;
}
