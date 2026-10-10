"use client";

import { useState, useRef } from "react";
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Lock,
  LoaderCircle,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { useDialogFocus } from "@/hooks/use-dialog-focus";
import { Brand } from "./brand";
import { PLANS } from "@/lib/market-data";

export default function PricingModal() {
  const {
    pricingModalOpen,
    closePricingModal,
    pricingSource,
    handleUpgrade,
    isUpgrading,
    checkoutError,
    plan,
    handleManageSubscription,
  } = useDashboard();

  const [activeFaq, setActiveFaq] = useState(null);

  const dialogRef = useRef(null);
  useDialogFocus(pricingModalOpen, dialogRef, closePricingModal);
  if (!pricingModalOpen) return null;

  const proPrice = "$29.00";
  const proBilledText = "Billed monthly";

  const faqs = [
    {
      q: "Is real market data used in Redline Pro?",
      a: "Currently, Redline runs on a high-fidelity deterministic demo dataset designed for institutional simulation and terminal evaluation. Live WebSocket market feeds and API connections are scheduled for subsequent production releases.",
    },
    {
      q: "How does checkout work?",
      a: "Proceed to Checkout opens Polar hosted checkout for Redline Pro. Sign in first, then review the final price and billing interval before confirming. The configured Pro subscription costs $29 per month.",
    },
    {
      q: "Can I switch between Free and Pro at any time?",
      a: "Yes. Pro subscriptions can be canceled or changed at any time without long-term commitment. You retain Pro access until the conclusion of your billing cycle.",
    },
    {
      q: "What is the Free tier watchlist limit?",
      a: "Free tier users can monitor up to 5 assets simultaneously. Upgrading to Pro eliminates all watchlist caps and enables custom multi-list categorization and price alerts.",
    },
  ];

  const sourceLabels = {
    header_cta: "Unlock the Full Redline Terminal",
    watchlist_limit: "Watchlist Limit Reached (5/5 Assets)",
    technical_indicators: "Unlock Advanced Technical Indicators",
    risk_analytics: "Access Institutional Risk & VaR Models",
    stock_comparison: "Unlock Multi-Asset Comparison Engine",
    research_reports: "Access Institutional Research Deep Dives",
    plan_badge: "Elevate to Redline Pro",
  };

  const currentHeadline = sourceLabels[pricingSource] || "Elevate Your Trading Edge with Redline Pro";

  return (
    <>
      {pricingModalOpen && (
        <div className="pricing-modal-backdrop" onClick={closePricingModal}>
          <div
            ref={dialogRef}
            className="pricing-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-modal-title"
          >
            {/* Header */}
            <div className="pricing-modal-header">
              <div className="pricing-modal-header-top">
                <Brand />
                <button
                  type="button"
                  className="icon-button"
                  onClick={closePricingModal}
                  aria-label="Close pricing modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="pricing-modal-title-block">
                <div className="pricing-badge-strip">
                  <span className="demo-pricing-tag">
                    <Info size={11} /> SANDBOX BILLING · POLAR CHECKOUT
                  </span>
                  <span className="pricing-source-badge">
                    <Sparkles size={11} /> {currentHeadline}
                  </span>
                </div>
                <h2 id="pricing-modal-title">
                  Professional market intelligence. <span>Zero compromise.</span>
                </h2>
                <p>
                  Choose the plan that fits your strategy. Experience institutional-grade charting,
                  portfolio risk intelligence, and deep equity research.
                </p>
              </div>

              {/* Billing Toggle */}
              <p className="billing-hint">$29 per month. Cancel anytime through the billing portal.</p>
            </div>

            {/* Plans Grid */}
            <div className="pricing-plans-grid">
              {/* Free Card */}
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
                  <span className="features-label">INCLUDED IN FREE</span>
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
                  <span className="plan-guarantee">No credit card required</span>
                </div>
              </div>

              {/* Pro Card */}
              <div className={`pricing-card pro-card ${plan === "pro" ? "current-tier" : ""}`}>
                <div className="pro-highlight-glow" />
                <div className="pro-popular-ribbon">
                  <Sparkles size={11} /> MOST POPULAR · TERMINAL CHOICE
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
                      <Lock size={11} /> 14-day risk-free guarantee · Cancel anytime
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="pricing-matrix-section">
              <div className="matrix-heading">
                <h4>Comprehensive Capability Matrix</h4>
                <p>Compare core terminal features side by side.</p>
              </div>

              <div className="matrix-table-wrap">
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Free</th>
                      <th>Pro Terminal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Stock Universe & Market Indices</td>
                      <td>Standard (16 Blue Chips)</td>
                      <td>Full Universe + Extended Hours</td>
                    </tr>
                    <tr>
                      <td>Watchlist Capacity</td>
                      <td>5 Assets Max</td>
                      <td><span className="matrix-highlight">Unlimited Assets</span></td>
                    </tr>
                    <tr>
                      <td>Chart Types</td>
                      <td>Area & Candlestick</td>
                      <td>Area, Candlestick + Volume Profile</td>
                    </tr>
                    <tr>
                      <td>Technical Indicators (RSI, EMA, Bollinger)</td>
                      <td>Single Asset Preview</td>
                      <td><span className="matrix-highlight">Full Multi-Asset Suite</span></td>
                    </tr>
                    <tr>
                      <td>Multi-Asset Stock Comparison</td>
                      <td>Locked</td>
                      <td><span className="matrix-highlight">Up to 4 Assets Overlay</span></td>
                    </tr>
                    <tr>
                      <td>Portfolio Risk Analytics (Sharpe, VaR)</td>
                      <td>Basic Equity Total</td>
                      <td><span className="matrix-highlight">Full VaR, Beta & Stress Testing</span></td>
                    </tr>
                    <tr>
                      <td>Automated Portfolio Rebalancing</td>
                      <td>Locked</td>
                      <td><span className="matrix-highlight">AI Factor Exposure Optimizer</span></td>
                    </tr>
                    <tr>
                      <td>Custom Price & Breakout Alerts</td>
                      <td>Sample Only</td>
                      <td><span className="matrix-highlight">Unlimited Instant Triggers</span></td>
                    </tr>
                    <tr>
                      <td>Institutional Equity Research</td>
                      <td>Sample Briefings</td>
                      <td><span className="matrix-highlight">Deep Dives & DCF Models</span></td>
                    </tr>
                    <tr>
                      <td>Report Exporting</td>
                      <td>Standard CSV</td>
                      <td><span className="matrix-highlight">Audit-Grade CSV & PDF</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trust & Guarantees */}
            <div className="pricing-trust-bar">
              <div className="trust-item">
                <ShieldCheck size={18} />
                <div>
                  <strong>Bank-Grade Encryption</strong>
                  <small>256-bit TLS security standards</small>
                </div>
              </div>
              <div className="trust-item">
                <CreditCard size={18} />
                <div>
                  <strong>Polar Hosted Checkout</strong>
                  <small>Review the final plan before confirming payment</small>
                </div>
              </div>
              <div className="trust-item">
                <Lock size={18} />
                <div>
                  <strong>No Lock-In</strong>
                  <small>Cancel anytime with one click in your settings</small>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="pricing-faq-section">
              <h4>Frequently Asked Questions</h4>
              <div className="faq-grid">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`faq-card ${activeFaq === i ? "is-expanded" : ""}`}
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    <div className="faq-question">
                      <span>{faq.q}</span>
                      <ChevronDown size={14} className="faq-arrow" />
                    </div>
                    {activeFaq === i && <p className="faq-answer">{faq.a}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Demo Banner */}
            <div className="pricing-modal-bottom-bar">
              <span>
                <Sparkles size={13} className="red-text" /> <b>Sandbox billing:</b> Review the final plan, price, and billing interval in Polar Checkout.
              </span>
              <button
                type="button"
                className="button-secondary"
                onClick={closePricingModal}
              >
                Return to Terminal
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

