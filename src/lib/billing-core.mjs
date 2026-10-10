export const REDLINE_PRO_PRODUCT_ID = "101f32f7-ae31-4680-bc3c-a006fff94e06";

export function hasProAccess(subscription, now = new Date()) {
  return Boolean(subscription && subscription.productId === REDLINE_PRO_PRODUCT_ID &&
    subscription.entitled && ["active", "trialing", "past_due"].includes(subscription.status) &&
    !subscription.endedAt && subscription.currentPeriodEnd &&
    new Date(subscription.currentPeriodEnd) > now);
}

// All reads and writes for a user share a database lock. Even concurrent,
// out-of-order webhook deliveries fetch current Polar state inside this lock.
export function createBillingService({ db, getCustomer, listSubscriptions }) {
  return {
    async reconcileUser(userId) {
      return db.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${userId}, 0))`;
        if (!await tx.user.findUnique({ where: { id: userId }, select: { id: true } })) return [];
        let customer;
        try {
          customer = await getCustomer(userId);
        } catch (error) {
          if (error.status === 404 || error.statusCode === 404) {
            await tx.billingSubscription.updateMany({ where: { userId }, data: { entitled: false, reconciledAt: new Date() } });
            return [];
          }
          throw error;
        }
        if (customer.external_id !== userId) throw new Error("Polar external customer ID mismatch");
        const activeIds = new Set(customer.active_subscriptions.map((s) => s.id));
        const subscriptions = [];
        for await (const subscription of listSubscriptions(userId)) {
          if (subscription.customer_id !== customer.id || subscription.customer?.external_id !== userId) {
            throw new Error("Subscription owner mismatch");
          }
          if (subscription.product_id !== REDLINE_PRO_PRODUCT_ID) continue;
          subscriptions.push(subscription);
        }
        await tx.billingSubscription.updateMany({ where: { userId }, data: { entitled: false, reconciledAt: new Date() } });
        for (const s of subscriptions) {
          const data = {
            polarCustomerId: customer.id, productId: s.product_id, status: s.status,
            currentPeriodEnd: s.current_period_end ? new Date(s.current_period_end) : null,
            cancelAtPeriodEnd: s.cancel_at_period_end, canceledAt: s.canceled_at ? new Date(s.canceled_at) : null,
            endedAt: s.ended_at ? new Date(s.ended_at) : null,
            entitled: activeIds.has(s.id), reconciledAt: new Date(),
          };
          const existing = await tx.billingSubscription.findUnique({ where: { polarSubscriptionId: s.id } });
          if (existing && existing.userId !== userId) throw new Error("Persisted subscription owner mismatch");
          await tx.billingSubscription.upsert({
            where: { polarSubscriptionId: s.id }, update: data,
            create: { ...data, userId, polarSubscriptionId: s.id },
          });
        }
        return tx.billingSubscription.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      }, { maxWait: 20000, timeout: 60000 });
    },
  };
}
