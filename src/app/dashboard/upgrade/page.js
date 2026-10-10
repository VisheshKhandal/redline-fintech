"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  HelpCircle,
  Info,
  Lock,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { PLANS } from "@/lib/market-data";
import { useDashboard } from "@/context/dashboard-context";
import { PlanBadge } from "@/components/redline/premium-gate";

export default function UpgradePage() {
  const {
    plan,
    handleManageSubscription,
    handleUpgrade,
    isUpgrading,
    checkoutError,
  } = useDashboard();

  const proPrice = "$29.00";
  const proBilledText = "Billed monthly";

  return (
    <div className="upgrade-page enter">
      {/* Header */}
      <section className="overview-heading text-center">
        <div className="mx-auto max-w-2xl">
          <span className="eyebrow justify-center">
            <span className="status-dot" /> REDLINE PRO MEMBERSHIP
          </span>
          <h1>
            Elevate to <span>Redline Pro.</span>
          </h1>
          <p>
            Gain an institutional edge with advanced technical oscillators,
            portfolio risk modeling, unlimited custom watchlists, and Wall Street
            equity research.
          </p>

          <div className="upgrade-demo-disclaimer-pill">
            <Info size={13} />
            <span>
              Sandbox billing · Final price and billing interval shown at checkout
            </span>
          </div>
        </div>
      </section>

      {/* Billing Interval Toggle */}
      <p className="billing-hint">Monthly subscription. Cancel anytime through the billing portal.</p>

      {/* Plan Cards Grid */}
      <div className="pricing-plans-grid upgrade-page-grid">
        {/* Free Plan Card */}
        <div className={`pricing-card free-card ${plan === "free" ? "current-tier" : ""}`}>
          <div className="pricing-card-header">
            <div className="plan-name-row">
              <h3>Redline Free</h3>
              {plan === "free" && <span className="tier-pill current">CURRENT PLAN</span>}
            </div>
            <p className="plan-tagline">{PLANS.FREE.tagline}</p>
            <div className="plan-price">
              <strong>$0</strong>
              <span>/ month forever</span>
            </div>
          </div>

          <div className="pricing-card-features">
            <span className="features-label">INCLUDED CAPABILITIES</span>
            <ul>
              {PLANS.FREE.features.map((feat, i) => (
                <li key={i} className={feat.included ? "feat-yes" : "feat-no"}>
                  {feat.included ? (
                    <Check size={14} className="check-icon" />
                  ) : (
                    <X size={14} className="cross-icon" />
                  )}
                  <span>{feat.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pricing-card-footer">
            <button
              type="button"
              className="plan-button free-btn"
              disabled={plan === "free"}
              onClick={handleManageSubscription}
            >
              {plan === "free" ? "Active Free Tier" : "Manage Subscription"}
            </button>
            <span className="plan-guarantee">Standard features always free</span>
          </div>
        </div>

        {/* Pro Plan Card */}
        <div className={`pricing-card pro-card ${plan === "pro" ? "current-tier" : ""}`}>
          <div className="pro-highlight-glow" />
          <div className="pro-popular-ribbon">
            <Sparkles size={11} /> MOST POPULAR · TERMINAL TRADER
          </div>

          <div className="pricing-card-header">
            <div className="plan-name-row">
              <h3>Redline Pro Terminal</h3>
              {plan === "pro" && <span className="tier-pill active-pro">ACTIVE PRO</span>}
            </div>
            <p className="plan-tagline">{PLANS.PRO.tagline}</p>
            <div className="plan-price">
              <strong>{proPrice}</strong>
              <span>/ month</span>
              <small>{proBilledText}</small>
            </div>
          </div>

          <div className="pricing-card-features">
            <span className="features-label">EVERYTHING IN FREE, PLUS:</span>
            <ul>
              {PLANS.PRO.features.map((feat, i) => (
                <li key={i} className="feat-yes pro-feat">
                  <Check size={14} className="check-icon pro-check" />
                  <span>{feat.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pricing-card-footer">
            <button
              type="button"
              className="plan-button pro-btn"
              onClick={handleUpgrade}
              disabled={isUpgrading}
              aria-busy={isUpgrading}
            >
              {isUpgrading ? <LoaderCircle size={15} className="spin" /> : <Zap size={15} />}
              <span>{isUpgrading ? "Opening checkout..." : "Proceed to Polar Checkout"}</span>
              <ArrowRight size={14} />
            </button>
            {checkoutError && <p className="auth-error" role="alert">{checkoutError}</p>}
            <div className="pro-meta-links">
              <span className="plan-guarantee">
                <Lock size={11} /> 14-day money-back guarantee · Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Matrix */}
      <section className="pricing-matrix-section mt-10">
        <div className="matrix-heading">
          <h2>Full Tier Comparison Matrix</h2>
          <p>Detailed side-by-side entitlement breakdown.</p>
        </div>

        <div className="matrix-table-wrap">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Platform Feature</th>
                <th>Redline Free</th>
                <th>Redline Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Stock Universe & Markets Screener</td>
                <td>16 Blue Chip Assets</td>
                <td>Full Universe + Extended Hours</td>
              </tr>
              <tr>
                <td>Watchlist Limit</td>
                <td>Up to 5 Assets</td>
                <td><span className="matrix-highlight">Unlimited Assets</span></td>
              </tr>
              <tr>
                <td>Technical Indicators (RSI, EMA, Bollinger)</td>
                <td>1 Asset Sample Preview</td>
                <td><span className="matrix-highlight">Multi-Indicator Overlay Suite</span></td>
              </tr>
              <tr>
                <td>Multi-Asset Stock Comparison</td>
                <td>Locked</td>
                <td><span className="matrix-highlight">Up to 4 Assets Overlay</span></td>
              </tr>
              <tr>
                <td>Portfolio Risk Analytics (Sharpe, VaR)</td>
                <td>Total Equity Only</td>
                <td><span className="matrix-highlight">Full VaR, Beta & Stress Testing</span></td>
              </tr>
              <tr>
                <td>Custom Breakout & Volatility Alerts</td>
                <td>Sample Presets</td>
                <td><span className="matrix-highlight">Unlimited Instant Custom Alerts</span></td>
              </tr>
              <tr>
                <td>Institutional Research Reports</td>
                <td>Sample Editorial</td>
                <td><span className="matrix-highlight">40+ Page Deep Dives & DCF Models</span></td>
              </tr>
              <tr>
                <td>Audit-Grade PDF & CSV Exporting</td>
                <td>Basic Prices CSV</td>
                <td><span className="matrix-highlight">Full Tax Lot & Risk PDF Reports</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust & Guarantees */}
      <div className="pricing-trust-bar">
        <div className="trust-item">
          <ShieldCheck size={18} />
          <div>
            <strong>Bank-Grade Encryption</strong>
            <small>256-bit TLS security verified</small>
          </div>
        </div>
        <div className="trust-item">
          <CreditCard size={18} />
          <div>
            <strong>Polar Hosted Checkout</strong>
            <small>Review your plan before confirming payment</small>
          </div>
        </div>
        <div className="trust-item">
          <Lock size={18} />
          <div>
            <strong>Zero Lock-In</strong>
            <small>Cancel anytime with 1 click in your account</small>
          </div>
        </div>
      </div>
    </div>
  );
}

