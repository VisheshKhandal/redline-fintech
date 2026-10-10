"use client";

import { CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { PlanBadge } from "@/components/redline/premium-gate";

export default function BillingPage() {
  const { billing, isPro, billingLoading, billingError, refreshBilling, handleManageSubscription, handleUpgrade, isUpgrading } = useDashboard();
  const subscription = billing.subscription;
  const date = subscription?.currentPeriodEnd
    ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(subscription.currentPeriodEnd)) : "Not available";
  return (
    <div className="upgrade-page enter">
      <section className="overview-heading">
        <div><span className="eyebrow"><ShieldCheck size={14} /> YOUR MEMBERSHIP</span>
          <h1>Billing. <span>Always in control.</span></h1>
          <p>Manage your Redline subscription securely through Polar Sandbox.</p></div>
        <PlanBadge />
      </section>
      <section className="panel" style={{ padding: "clamp(24px, 5vw, 48px)", maxWidth: 850 }}>
        <div className="panel-heading"><h2><CreditCard size={20} /> {isPro ? "Redline Pro" : "Redline Free"}</h2><span className="demo-tag">SANDBOX BILLING</span></div>
        {billingError && <p className="auth-error" role="alert">{billingError}</p>}
        <dl className="billing-details">
          <div><dt>Current plan</dt><dd>{billingLoading ? "Verifying..." : isPro ? "Pro Member" : "Free"}</dd></div>
          <div><dt>Redline Pro</dt><dd>$29 / month</dd></div>
          <div><dt>Subscription status</dt><dd>{subscription?.status?.replaceAll("_", " ") || "No subscription"}</dd></div>
          <div><dt>{subscription?.cancelAtPeriodEnd ? "Access through" : "Current period ends / renewal"}</dt><dd>{date} {subscription?.currentPeriodEnd && "(UTC)"}</dd></div>
          <div><dt>Cancellation</dt><dd>{subscription?.cancelAtPeriodEnd ? "Scheduled at period end" : subscription ? "Not scheduled" : "Not applicable"}</dd></div>
        </dl>
        <div className="overview-heading-actions">
          {subscription ? <button className="button-primary" onClick={handleManageSubscription}>Manage Subscription</button>
            : <button className="button-primary" onClick={handleUpgrade} disabled={isUpgrading || billingLoading}>{isUpgrading ? "Opening checkout..." : "Upgrade to Pro"}</button>}
          <button className="button-secondary" onClick={refreshBilling} disabled={billingLoading}><RefreshCw size={14} /> Refresh status</button>
        </div>
        <p className="muted" style={{ marginTop: 24 }}>A scheduled cancellation keeps eligible access until the current period ends. Payment details, invoices and cancellation are managed in Polar.</p>
      </section>
    </div>
  );
}
