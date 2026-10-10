-- CreateTable
ALTER TABLE "user" ADD COLUMN "watchlistSymbols" TEXT[] NOT NULL DEFAULT ARRAY['NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN']::TEXT[];

CREATE TABLE "BillingSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "polarCustomerId" TEXT NOT NULL,
    "polarSubscriptionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "entitled" BOOLEAN NOT NULL DEFAULT false,
    "reconciledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingSubscription_polarSubscriptionId_key" ON "BillingSubscription"("polarSubscriptionId");

-- CreateIndex
CREATE INDEX "BillingSubscription_userId_productId_idx" ON "BillingSubscription"("userId", "productId");

-- CreateIndex
CREATE INDEX "BillingSubscription_polarCustomerId_idx" ON "BillingSubscription"("polarCustomerId");

-- AddForeignKey
ALTER TABLE "BillingSubscription" ADD CONSTRAINT "BillingSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
