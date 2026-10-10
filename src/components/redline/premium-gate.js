"use client";

import { Lock, Sparkles, ArrowRight, ShieldCheck, Zap, LoaderCircle } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";

export function PlanBadge({ className = "", showUpgradePrompt = true }) {
  const { isPro, openPricingModal } = useDashboard();

  if (isPro) {
    return (
      <span className={`plan-badge pro-active ${className}`}>
        <span className="pro-gem" />
        <span className="pro-text">PRO MEMBER</span>
      </span>
    );
  }

  return (
    <span className={`plan-badge free-tier ${className}`}>
      <span className="free-dot" />
      <span className="free-text">FREE PLAN</span>
      {showUpgradePrompt && (
        <button
          type="button"
          className="plan-badge-upgrade-link"
          onClick={() => openPricingModal("plan_badge")}
          title="Upgrade to Redline Pro"
        >
          UPGRADE <Sparkles size={10} />
        </button>
      )}
    </span>
  );
}

export function UpgradeButton({
  label = "Upgrade to Pro",
  source = "general_cta",
  variant = "primary", // "primary" | "secondary" | "subtle"
  size = "md", // "sm" | "md" | "lg"
  icon = true,
  className = "",
  onClick,
}) {
  const { handleUpgrade, isUpgrading } = useDashboard();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      handleUpgrade();
    }
  };

  return (
    <button
      type="button"
      className={`upgrade-btn upgrade-btn-${variant} upgrade-btn-${size} ${className}`}
      onClick={handleClick}
      disabled={isUpgrading}
      aria-busy={isUpgrading}
    >
      {isUpgrading ? <LoaderCircle size={14} className="spin" /> : icon && <Sparkles size={size === "sm" ? 12 : 14} className="upgrade-spark" />}
      <span>{isUpgrading ? "Opening checkout..." : label}</span>
      <ArrowRight size={size === "sm" ? 12 : 14} className="upgrade-arrow" />
    </button>
  );
}

export function PremiumGate({
  featureName = "Advanced Analytics",
  description = "Unlock institutional quantitative models, real-time indicators, and deep market signals.",
  benefits = [
    "Institutional order flow & dark pool volume tracking",
    "Real-time technical indicators (RSI, EMA, Bollinger)",
    "Downloadable audit-grade PDF/CSV financial reports",
  ],
  source = "premium_gate",
  badge = "REDLINE PRO SUITE",
  variant = "full", // "full" | "compact"
  children,
}) {
  const { isPro, openPricingModal } = useDashboard();

  if (isPro) {
    return <div className="premium-gate-unlocked">{children}</div>;
  }

  return (
    <div className={`premium-gate-section variant-${variant}`}>
      {/* Background preview: subtle, authentic glimpse into the underlying feature */}
      <div className="premium-gate-backdrop" aria-hidden="true">
        <div className="panel" style={{ minHeight: 260 }} />
      </div>

      {/* Foreground edge-to-edge immersive showcase */}
      <div className="premium-gate-overlay">
        <div className="premium-gate-inner">
          <div className="premium-gate-meta-row">
            <div className="premium-gate-badge">
              <Lock size={12} className="lock-icon" />
              <span>{badge}</span>
            </div>
            <span className="premium-gate-tag">FULL ACCESS ONLY</span>
          </div>

          <h3 className="premium-gate-title">{featureName}</h3>
          <p className="premium-gate-desc">{description}</p>

          {benefits && benefits.length > 0 && (
            <div className="premium-gate-benefits">
              {benefits.map((benefit, i) => (
                <div key={i} className="premium-gate-benefit-item">
                  <ShieldCheck size={14} className="benefit-check" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}

          <div className="premium-gate-footer">
            <button
              type="button"
              className="premium-gate-cta"
              onClick={() => openPricingModal(source)}
            >
              <Zap size={14} />
              <span>Unlock with Pro</span>
              <ArrowRight size={13} />
            </button>

            <div className="premium-gate-pricing-info">
              <span className="price-tag">
                <b>$29</b>/month · Cancel anytime
              </span>
              <button
                type="button"
                className="plan-details-link"
                onClick={() => openPricingModal(source)}
              >
                View all Pro features ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProFeaturePreview({
  badge = "PRO PREVIEW",
  featureName,
  summary,
  source = "pro_preview",
  children,
}) {
  const { isPro, openPricingModal } = useDashboard();

  return (
    <div className="pro-feature-preview">
      <div className="pro-feature-banner">
        <div className="pro-feature-banner-left">
          <span className="pro-feature-badge">
            <Sparkles size={11} /> {badge}
          </span>
          {featureName && <strong className="pro-feature-title">{featureName}</strong>}
          {summary && <span className="pro-feature-summary">{summary}</span>}
        </div>
        {!isPro && (
          <button
            type="button"
            className="pro-feature-banner-cta"
            onClick={() => openPricingModal(source)}
          >
            <span>Unlock Universe</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>
      <div className="pro-feature-body">{children}</div>
    </div>
  );
}
