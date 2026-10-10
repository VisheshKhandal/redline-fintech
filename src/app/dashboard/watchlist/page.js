"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BellRing,
  Download,
  Filter,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import {
  money,
  sampleWatchlistAlerts,
  signed,
  stocks,
} from "@/lib/market-data";
import { Sparkline } from "@/components/redline/market-chart";
import { useDashboard } from "@/context/dashboard-context";
import {
  PlanBadge,
  PremiumGate,
  UpgradeButton,
} from "@/components/redline/premium-gate";

function StockBadge({ stock }) {
  return (
    <span
      className="stock-badge"
      style={{ "--stock-color": stock.color }}
    >
      {stock.symbol === "AAPL" ? "a" : stock.symbol.slice(0, 1)}
    </span>
  );
}

export default function WatchlistPage() {
  const {
    isPro,
    authorizePro,
    watchlist,
    toggleWatchlist,
    watchlistLimit,
    openPricingModal,
    setNotice,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState("core"); // "core" | "semis" | "dividends" | "momentum"
  const [filterQuery, setFilterQuery] = useState("");
  const [addSymbol, setAddSymbol] = useState("");

  // Available stocks to add
  const availableToAdd = stocks.filter((s) => !watchlist.includes(s.symbol));

  // Watched stock objects
  const watchedStockObjects = stocks.filter((s) => watchlist.includes(s.symbol));

  const filteredWatched = watchedStockObjects.filter(
    (s) =>
      s.symbol.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const usagePercent = Math.min(100, (watchlist.length / 5) * 100);

  function handleAddStock(symbol) {
    if (!symbol) return;
    const success = toggleWatchlist(symbol);
    if (success) {
      setAddSymbol("");
    }
  }

  function exportWatchlist() {
    const csv =
      `Symbol,Name,Sector,Price,ChangePct,Volume,MarketCap,PE\n` +
      watchedStockObjects
        .map(
          (s) =>
            `"${s.symbol}","${s.name}","${s.sector}",${s.price},${s.change},"${s.volume}","${s.marketCap}",${s.peRatio}`
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `redline-watchlist-demo.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Watchlist exported to CSV.");
  }

  const tabLabels = {
    semis: "Dedicated SEMIS Multi-List & Segment Alerts",
    dividends: "Dividend Growth Multi-List & Yield Radar",
    momentum: "Swing Momentum Multi-List & Breakout Triggers",
  };

  return (
    <div className="watchlist-page enter">
      {/* Header */}
      <section className="overview-heading">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> CUSTOM ASSET RADAR & ALERTS
          </span>
          <h1>
            My Watchlist. <span>In focus.</span>
          </h1>
          <p>
            Monitor high-conviction ideas, track price dynamics, and configure
            smart breakout threshold alerts.
          </p>
        </div>

        <div className="overview-heading-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={exportWatchlist}
          >
            <Download size={14} /> Export Watchlist <ArrowUpRight size={13} />
          </button>
        </div>
      </section>

      {/* Free Limit Meter / Pro Status Bar */}
      <div className={`watchlist-capacity-bar ${isPro ? "is-pro-capacity" : ""}`}>
        <div className="capacity-info">
          <div className="capacity-label-row">
            <strong>
              {isPro ? "Unlimited Watchlist Capacity" : "Free Plan Watchlist Limit"}
            </strong>
            <span className="capacity-numbers">
              {isPro
                ? `${watchlist.length} Assets Active (No Limit)`
                : `${watchlist.length} of 5 Slots Used`}
            </span>
          </div>

          {!isPro && (
            <div className="capacity-meter">
              <div
                className={`meter-fill ${
                  watchlist.length >= 5 ? "meter-full" : ""
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
        </div>

        {!isPro ? (
          <div className="capacity-action">
            <button
              type="button"
              className="capacity-upgrade-cta"
              onClick={() => openPricingModal("watchlist_limit")}
            >
              <Sparkles size={12} />
              <span>Unlock Unlimited Watchlists</span>
              <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          <div className="pro-active-capacity-pill">
            <Zap size={13} className="red-text" />
            <span>UNLIMITED ASSETS · MULTI-LISTS ENABLED</span>
          </div>
        )}
      </div>

      {/* Multi-List Category Tabs */}
      <div className="watchlist-tabs-bar">
        <div className="segmented-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "core" ? "active" : ""}`}
            onClick={() => setActiveTab("core")}
          >
            Core Radar ({watchlist.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "semis" ? "active" : ""}`}
            onClick={async () => { if (await authorizePro("custom_watchlist")) setActiveTab("semis"); }}
          >
            AI & Semiconductors {!isPro && <Sparkles size={10} className="red-text" />}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "dividends" ? "active" : ""}`}
            onClick={async () => { if (await authorizePro("custom_watchlist")) setActiveTab("dividends"); }}
          >
            Dividend Growth {!isPro && <Sparkles size={10} className="red-text" />}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "momentum" ? "active" : ""}`}
            onClick={async () => { if (await authorizePro("custom_watchlist")) setActiveTab("momentum"); }}
          >
            Swing Momentum {!isPro && <Sparkles size={10} className="red-text" />}
          </button>
        </div>

        {/* Quick Add Stock Selector */}
        <div className="quick-add-group">
          <select
            className="stock-select-dropdown"
            value={addSymbol}
            onChange={(e) => handleAddStock(e.target.value)}
          >
            <option value="">+ Add stock to radar...</option>
            {availableToAdd.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} — {s.name} ({money(s.price)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Content: If Pro list selected, display full-width PremiumGate */}
      {activeTab !== "core" ? (
        <section className="panel multi-list-gated-panel">
          <div className="panel-heading">
            <div className="section-title">
              <span className="red-marker" />
              <h2>{tabLabels[activeTab]}</h2>
            </div>
            <span className="subtle-tag">PRO MULTI-LIST</span>
          </div>

          <PremiumGate
            featureName={tabLabels[activeTab]}
            description="Organize your portfolio discovery into unlimited targeted sub-lists with independent notification thresholds, sector beta scoring, and automated breakout alerts."
            benefits={[
              "Unlimited thematic watchlists (Dividends, AI, Crypto, Momentum)",
              "Multi-list correlation heatmap and aggregate sector beta",
              "Instant portfolio rebalancing alerts tied to list triggers",
            ]}
            source="watchlist_multi_list"
          >
            <div className="pro-list-preview-content">
              <div className="watched-cards-grid">
                {stocks.slice(0, 4).map((s) => (
                  <div key={s.symbol} className="watched-card">
                    <div className="watched-card-header">
                      <div className="watched-asset-id">
                        <StockBadge stock={s} />
                        <div>
                          <h3>{s.symbol}</h3>
                          <small>{s.name}</small>
                        </div>
                      </div>
                    </div>
                    <div className="watched-card-sparkline">
                      <Sparkline seed={stocks.indexOf(s) + 1} negative={s.change < 0} />
                    </div>
                    <div className="watched-card-bottom">
                      <div className="watched-price-block">
                        <strong className="watched-price">{money(s.price)}</strong>
                        <span className={`change ${s.change >= 0 ? "positive" : "negative"}`}>
                          {signed(s.change)}
                        </span>
                      </div>
                      <div className="watched-actions-block">
                        <span className="watched-sector-badge">{s.sector}</span>
                        <span className="watched-chart-btn">Inspect ↗</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PremiumGate>
        </section>
      ) : (
        /* Core Watchlist Grid */
        <div className="watchlist-content-layout">
          {/* Left: Main Watched Assets Grid */}
          <section className="panel watched-assets-panel">
            <div className="panel-heading">
              <div className="section-title">
                <span className="red-marker" />
                <h2>Active Monitored Assets</h2>
                <span className="count-badge">{watchedStockObjects.length}</span>
              </div>

              <div className="search-mini">
                <Search size={14} />
                <input
                  placeholder="Filter radar..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="watched-cards-grid">
              {filteredWatched.map((stock) => (
                <div key={stock.symbol} className="watched-card">
                  <div className="watched-card-header">
                    <div className="watched-asset-id">
                      <StockBadge stock={stock} />
                      <div>
                        <h3>{stock.symbol}</h3>
                        <small>{stock.name}</small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="icon-button watched-remove-btn"
                      onClick={() => toggleWatchlist(stock.symbol)}
                      title={`Remove ${stock.symbol} from watchlist`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="watched-card-sparkline">
                    <Sparkline
                      seed={stocks.indexOf(stock) + 1}
                      negative={stock.change < 0}
                    />
                  </div>

                  <div className="watched-card-bottom">
                    <div className="watched-price-block">
                      <strong className="watched-price">
                        {money(stock.price)}
                      </strong>
                      <span
                        className={`change ${
                          stock.change >= 0 ? "positive" : "negative"
                        }`}
                      >
                        {signed(stock.change)}
                      </span>
                    </div>

                    <div className="watched-actions-block">
                      <span className="watched-sector-badge">{stock.sector}</span>
                      <Link
                        href={`/dashboard/markets?symbol=${stock.symbol}`}
                        className="watched-chart-btn"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {filteredWatched.length === 0 && (
                <div className="empty-state watchlist-empty">
                  <Star size={28} />
                  <b>Your radar is waiting</b>
                  <p>
                    Select an asset from the dropdown above or browse the Markets
                    tab to star assets.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right Sidebar: Smart Alerts & Breakout Triggers */}
          <aside className="watchlist-alerts-sidebar">
            {/* Custom Alerts Box */}
            <section className="panel alerts-panel">
              <div className="panel-heading">
                <div className="section-title">
                  <BellRing size={16} className="red-text" />
                  <h3>Price & Volatility Alerts</h3>
                </div>
                <span className="count-badge">
                  {sampleWatchlistAlerts.length}
                </span>
              </div>

              <div className="alerts-list">
                {sampleWatchlistAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`alert-item ${
                      alert.triggered ? "alert-triggered" : ""
                    }`}
                  >
                    <div className="alert-item-header">
                      <b>{alert.symbol}</b>
                      <span
                        className={`alert-status-pill ${
                          alert.triggered ? "triggered" : "active"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                    <p className="alert-condition">{alert.condition}</p>
                    <small className="alert-date">Created {alert.created}</small>
                  </div>
                ))}
              </div>

              <div className="alerts-footer">
                <button
                  type="button"
                  className="button-secondary new-alert-btn"
                  onClick={() => openPricingModal("custom_alerts")}
                >
                  <Plus size={14} />
                  <span>Create Custom Alert</span>
                  {!isPro && <Sparkles size={11} className="red-text" />}
                </button>
              </div>
            </section>

            {/* Smart Breakout Signals (Pro Gated) */}
            <section className="panel quant-signals-panel">
              <div className="panel-heading">
                <div className="section-title">
                  <Zap size={16} className="red-text" />
                  <h3>Smart Breakout Signals</h3>
                </div>
                <span className="subtle-tag">QUANT AI</span>
              </div>

              <PremiumGate
                featureName="Smart Breakout Signals"
                description="Real-time algorithmic notifications when watched assets exhibit multi-day volume expansion or momentum crossovers."
                benefits={[
                  "Unusual options volume & gamma squeeze alerts",
                  "Bollinger Band squeeze and breakout triggers",
                  "Direct trade automation links",
                ]}
                source="quant_signals"
                variant="compact"
              >
                <div className="quant-signal-demo">
                  <div className="signal-item">
                    <span className="signal-dot green" />
                    <div>
                      <b>NVDA: Bullish Trend Acceleration</b>
                      <small>Volume +42% above 20D average</small>
                    </div>
                  </div>
                  <div className="signal-item">
                    <span className="signal-dot red" />
                    <div>
                      <b>TSLA: Resistance Rejection at $250</b>
                      <small>Overbought RSI reversal signal</small>
                    </div>
                  </div>
                </div>
              </PremiumGate>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
