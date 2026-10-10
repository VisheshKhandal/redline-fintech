"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Globe2,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Newspaper,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Brand } from "@/components/redline/brand";
import { DashboardProvider, useDashboard } from "@/context/dashboard-context";
import PricingModal from "@/components/redline/pricing-modal";
import { PlanBadge } from "@/components/redline/premium-gate";

const navigationItems = [
  { label: "Billing", href: "/dashboard/billing", icon: Zap, id: "billing" },
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    id: "overview",
  },
  {
    label: "Markets",
    href: "/dashboard/markets",
    icon: ChartNoAxesCombined,
    id: "markets",
  },
  {
    label: "My watchlist",
    href: "/dashboard/watchlist",
    icon: Star,
    id: "watchlist",
  },
  {
    label: "Portfolio",
    href: "/dashboard/portfolio",
    icon: BriefcaseBusiness,
    id: "portfolio",
  },
  {
    label: "Market briefing",
    href: "/dashboard/market-briefing",
    icon: Newspaper,
    id: "briefing",
  },
];

function DashboardShell({ children }) {
  const pathname = usePathname();
  const {
    plan,
    isPro,
    watchlist,
    openPricingModal,
    handleUpgrade,
    isUpgrading,
    notice,
    setNotice,
  } = useDashboard();

  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const signOutInFlight = useRef(false);

  async function handleSignOut() {
    if (signOutInFlight.current) return;
    signOutInFlight.current = true;
    setSigningOut(true);
    setNotice("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error();
      window.location.replace("/login");
    } catch {
      setNotice("Could not sign out. Please try again.");
      signOutInFlight.current = false;
      setSigningOut(false);
    }
  }

  // Derive breadcrumb label from pathname
  const currentNav = navigationItems.find(
    (item) => item.href === pathname || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );
  const activeLabel = currentNav ? currentNav.label : pathname === "/dashboard/upgrade" ? "Upgrade to Pro" : "Workspace";

  return (
    <div className="redline terminal">
      <a className="skip-link" href="#main-content">
        Skip to dashboard content
      </a>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Shared Sidebar */}
      <aside className={`terminal-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            type="button"
            className="icon-button mobile-only"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace-label">
          <span className="workspace-icon">R</span>
          <span>
            Personal workspace
            <small>FINANCIAL INTELLIGENCE</small>
          </span>
        </div>

        <span className="nav-label">WORKSPACE</span>

        <nav aria-label="Main navigation">
          {navigationItems.map(({ label, href, icon: Icon, id }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            return (
              <Link
                key={id}
                href={href}
                className={isActive ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {id === "watchlist" && (
                  <small title={`${watchlist.length} assets on watchlist`}>
                    {watchlist.length}
                    {!isPro && "/5"}
                  </small>
                )}
                {isActive && <span className="nav-active-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom Entitlement & Profile */}
        <div className="sidebar-bottom">
          {/* Plan Status Card */}
          <div className={`demo-workspace ${isPro ? "is-pro-workspace" : ""}`}>
            <div className="workspace-plan-header">
              <span className="demo-orbit">
                {isPro ? <Zap size={22} className="pro-orbit-icon" /> : <Globe2 size={22} />}
              </span>
              <span className={`plan-status-pill ${isPro ? "pro" : "free"}`}>
                {isPro ? "PRO ACTIVE" : "FREE TIER"}
              </span>
            </div>

            <strong>{isPro ? "Institutional Terminal" : "Perspective & Precision."}</strong>
            <p>
              {isPro
                ? "Full quantitative models, unrestricted watchlists & risk engine unlocked."
                : "Explore core markets. Upgrade to unlock multi-asset comparison & risk analytics."}
            </p>

            <div className="workspace-card-actions">
              {!isPro ? (
                <button
                  type="button"
                  className="sidebar-upgrade-btn"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  aria-busy={isUpgrading}
                >
                  {isUpgrading ? <LoaderCircle size={12} className="spin" /> : <Sparkles size={12} />}
                  <span>{isUpgrading ? "Opening checkout..." : "Upgrade to Pro"}</span>
                </button>
              ) : (
                <Link href="/dashboard/billing" className="sidebar-manage-btn">
                  <span>Plan Details</span>
                  <ArrowUpRight size={12} />
                </Link>
              )}

              {/* Interactive Demo Plan Simulator Switch */}
            </div>
          </div>

          {/* User Profile */}
          <div className="sidebar-user">
            <span className="user-avatar">
              {session?.user?.name?.charAt(0)?.toUpperCase() || <Activity size={17} />}
            </span>
            <span>
              <b>{isPending ? "Loading session…" : session?.user?.name || "Demo Explorer"}</b>
              <small>{session ? "Personal Account" : isPro ? "Pro Subscriber" : "Free Explorer"}</small>
            </span>
            {session ? (
              <button
                type="button"
                className="icon-button"
                aria-label="Sign out"
                disabled={signingOut}
                onClick={handleSignOut}
                aria-busy={signingOut}
              >
                {signingOut ? <LoaderCircle className="spin" size={16} /> : <LogOut size={16} />}
              </button>
            ) : (
              <Link href="/login" aria-label="Sign in">
                <ArrowUpRight size={17} />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Terminal Shell */}
      <div className="terminal-main">
        {/* Shared Topbar */}
        <header className="terminal-topbar">
          <div className="topbar-location">
            <button
              type="button"
              className="icon-button mobile-only"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <span className="muted">/</span>
            <b>{activeLabel}</b>
          </div>

          <div className="topbar-right">
            <span className="demo-tag">
              <span className="status-dot" /> Demo Data
            </span>
            <span className="topbar-date">FRI, OCT 09, 2026</span>
            <span className="market-status">
              <span className="status-dot" /> SAMPLE SNAPSHOT
            </span>

            {/* Plan Badge */}
            <PlanBadge />

            {/* Prominent Header Upgrade Button */}
            {!isPro && (
              <button
                type="button"
                className="topbar-upgrade-button"
                onClick={handleUpgrade}
                disabled={isUpgrading}
                aria-busy={isUpgrading}
                title="Unlock Redline Pro Terminal"
              >
                {isUpgrading ? <LoaderCircle size={13} className="spin" /> : <Sparkles size={13} className="sparkle-pulse" />}
                <span>{isUpgrading ? "Opening checkout..." : "Upgrade to Pro"}</span>
                <span className="btn-glow" />
              </button>
            )}

            {/* Auth Button */}
            {!isPending &&
              (session ? (
                <button
                  type="button"
                  className="dashboard-signout"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  aria-busy={signingOut}
                >
                  {signingOut ? <LoaderCircle size={14} className="spin" /> : <LogOut size={14} />}
                  <span>{signingOut ? "Signing out..." : "Sign out"}</span>
                </button>
              ) : (
                <Link className="dashboard-signout" href="/login">
                  Sign in <ArrowUpRight size={14} />
                </Link>
              ))}
          </div>
        </header>

        {/* Global Toast / Notice Bar */}
        {notice && (
          <div className="dashboard-notice enter" role="status">
            <span>{notice}</span>
            <button
              type="button"
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Page Content */}
        <main id="main-content" className="dashboard-content">
          {children}
        </main>
      </div>

      {/* Global Pricing Modal & Checkout Boundary */}
      <PricingModal />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}

