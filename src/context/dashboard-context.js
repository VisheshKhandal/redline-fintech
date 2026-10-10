"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { PLANS } from "@/lib/market-data";
import { authClient } from "@/lib/auth-client";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [billing, setBilling] = useState({ plan: "free", subscription: null });
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState("");
  const [premiumData, setPremiumData] = useState(null);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const userId = session?.user?.id;
  const plan = userId && billing.userId === userId ? billing.plan : "free";
  const [watchlist, setWatchlist] = useState(["NVDA", "AAPL", "MSFT", "TSLA", "AMZN"]);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [pricingSource, setPricingSource] = useState("header_cta");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const checkoutInFlight = useRef(false);
  const [notice, setNotice] = useState("");

  const isPro = plan === "pro" && premiumData !== null;
  const watchlistLimit = isPro ? 9999 : PLANS.FREE.watchlistLimit;

  // Auto-dismiss notice after 4 seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => {
      setNotice("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const refreshBilling = useCallback(async () => {
    setBillingLoading(true);
    try {
      const response = await fetch("/api/billing/plan", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setBilling(result);
      setBillingError("");
      if (result.plan === "pro") {
        const analytics = await fetch("/api/pro/analytics", { cache: "no-store" });
        if (!analytics.ok) throw new Error("Unable to verify premium access.");
        setPremiumData(await analytics.json());
      } else setPremiumData(null);
    } catch (error) {
      setBilling({ plan: "free", subscription: null });
      setPremiumData(null);
      setBillingError(error.message || "Unable to verify billing.");
    } finally { setBillingLoading(false); }
  }, []);

  useEffect(() => {
    if (sessionPending) return;
    let canceled = false;
    queueMicrotask(() => { if (!canceled) refreshBilling(); });
    if (!userId) return () => { canceled = true; };
    fetch("/api/watchlist", { cache: "no-store" }).then((r) => r.json()).then((data) => {
      if (data.symbols) setWatchlist(data.symbols);
    }).catch(() => {});
    const onFocus = () => refreshBilling();
    window.addEventListener("focus", onFocus);
    const timer = setInterval(onFocus, 60000);
    return () => { canceled = true; window.removeEventListener("focus", onFocus); clearInterval(timer); };
  }, [userId, sessionPending, refreshBilling]);

  async function handleManageSubscription() {
    try {
      const { error } = await authClient.customer.portal();
      if (error) throw new Error(error.message);
    } catch { setNotice("Unable to open billing portal. Please retry."); }
  }

  async function authorizePro(source = "premium_feature") {
    try {
      const response = await fetch("/api/pro/analytics", { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 403) openPricingModal(source);
        throw new Error("Premium access could not be verified.");
      }
      const data = await response.json();
      setPremiumData(data);
      return data;
    } catch { setNotice("Pro access required, or billing is temporarily unavailable."); return null; }
  }

  function openPricingModal(source = "header_cta") {
    setPricingSource(source);
    setPricingModalOpen(true);
  }

  function closePricingModal() {
    setPricingModalOpen(false);
  }

  function isWatchlisted(symbol) {
    return watchlist.includes(symbol);
  }

  async function toggleWatchlist(symbol) {
    if (!session) { setNotice("Please sign in to save your watchlist."); return false; }
    const symbols = watchlist.includes(symbol) ? watchlist.filter((s) => s !== symbol) : [...watchlist, symbol];
    try {
      const response = await fetch("/api/watchlist", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symbols }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 403) openPricingModal("watchlist_limit");
        throw new Error(result.error);
      }
      setWatchlist(result.symbols);
      setNotice("Watchlist saved.");
      return true;
    } catch (error) { setNotice(error.message); return false; }
  }

  async function handleUpgrade() {
    if (isPro) { await handleManageSubscription(); return; }
    if (checkoutInFlight.current) return;
    checkoutInFlight.current = true;
    setIsUpgrading(true);
    setCheckoutError("");
    try {
      const { error } = await authClient.checkout({ slug: "redline-pro" });
      if (error) {
        console.error("Checkout failed:", error.message);
        const message = error.status === 401
          ? "Please sign in before upgrading to Pro."
          : "Unable to start checkout. Please try again.";
        setCheckoutError(message);
        setNotice(message);
      }
    } catch {
      console.error("Checkout error: unable to start checkout.");
      const message = "Something went wrong starting checkout. Please try again.";
      setCheckoutError(message);
      setNotice(message);
    } finally {
      checkoutInFlight.current = false;
      setIsUpgrading(false);
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        plan,
        billing,
        billingLoading,
        billingError,
        refreshBilling,
        premiumData,
        authorizePro,
        handleManageSubscription,
        isPro,

        watchlist,
        setWatchlist,
        watchlistLimit,
        isWatchlisted,
        toggleWatchlist,
        pricingModalOpen,
        pricingSource,
        openPricingModal,
        closePricingModal,
        isUpgrading,
        checkoutError,
        handleUpgrade,

        notice,
        setNotice,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

