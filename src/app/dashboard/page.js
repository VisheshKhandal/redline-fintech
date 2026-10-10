"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChartCandlestick,
  ChartNoAxesCombined,
  Download,
  Eye,
  Globe2,
  Lock,
  Search,
  Sparkles,
  Star,
  Wallet,
  X,
  Zap,
  TrendingUp,
  Layers,
  Compass,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Brand } from "@/components/redline/brand";
import MarketChart, { Sparkline } from "@/components/redline/market-chart";
import {
  indices,
  makeSeries,
  money,
  news,
  signed,
  stocks,
  timeframes,
} from "@/lib/market-data";
import { useDashboard } from "@/context/dashboard-context";
import { PremiumGate, UpgradeButton } from "@/components/redline/premium-gate";

function Change({ value }) {
  return (
    <span className={`change ${value >= 0 ? "positive" : "negative"}`}>
      {value >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{" "}
      {signed(value)}
    </span>
  );
}

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

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const {
    isPro,
    watchlist,
    toggleWatchlist,
    isWatchlisted,
    openPricingModal,
    setNotice,
  } = useDashboard();

  const [selected, setSelected] = useState(stocks[0]);
  const [timeframe, setTimeframe] = useState("1D");
  const [chartType, setChartType] = useState("area");
  const [volume, setVolume] = useState(true);
  const [query, setQuery] = useState("");
  const [movers, setMovers] = useState("gainers");
  const [article, setArticle] = useState(news[0]);

  const dialogRef = useRef(null);

  const data = useMemo(
    () => makeSeries(selected, timeframe),
    [selected, timeframe]
  );

  const results = stocks.filter((stock) =>
    `${stock.symbol} ${stock.name}`.toLowerCase().includes(query.toLowerCase())
  );

  const movement = [...stocks]
    .filter((stock) => (movers === "gainers" ? stock.change > 0 : stock.change < 0))
    .sort((a, b) => (movers === "gainers" ? b.change - a.change : a.change - b.change))
    .slice(0, 4);

  function pickStock(stock) {
    setSelected(stock);
    document.getElementById("main-chart-panel")?.scrollIntoView({
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function exportData() {
    const csv =
      `Demo data only - ${selected.symbol} - ${timeframe}\nPeriod,Open,High,Low,Close\n` +
      data
        .map(
          (d) =>
            `"${d.label}",${d.open.toFixed(2)},${d.high.toFixed(2)},${d.low.toFixed(
              2
            )},${d.close.toFixed(2)}`
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `redline-demo-${selected.symbol}-${timeframe}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`${selected.symbol} ${timeframe} demo prices exported successfully.`);
  }

  return (
    <>
      {/* Overview Page Heading */}
      <section className="overview-heading enter">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> THE MARKET DOESN’T WAIT. NEITHER DO YOU.
          </span>
          <h1>
            Your market. <span>In focus.</span>
          </h1>
          <p>
            {session?.user?.name
              ? `Welcome back, ${session.user.name.split(" ")[0]}. `
              : "A clearer view of what’s moving. "}
            Comprehensive multi-asset intelligence and portfolio telemetry.
          </p>
        </div>

        <div className="overview-heading-actions">
          <Link href="/dashboard/markets" className="button-secondary">
            <Compass size={15} /> Explore Markets <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            className="button-secondary export-button"
            onClick={exportData}
          >
            <Download size={15} /> Export chart <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

      {/* Indices Bar */}
      <section className="indices-row" aria-label="Demo market indices">
        {indices.slice(0, 4).map((index, i) => (
          <article className="index-card" key={index.symbol}>
            <div>
              <span>{index.name}</span>
              <small>{index.symbol}</small>
            </div>
            <div className="index-values">
              <strong>{index.value}</strong>
              <Sparkline seed={i + 2} negative={index.change < 0} />
            </div>
            <Change value={index.change} />
            <small className="index-period"> vs. previous close</small>
          </article>
        ))}
      </section>

      {/* Main Market Grid */}
      <div className="market-grid">
        {/* Left: Main Chart Panel */}
        <section id="main-chart-panel" className="panel price-panel">
          <div className="panel-heading">
            <div className="section-title">
              <span className="red-marker" />
              <h2>Market overview</h2>
              <span className="subtle-tag">
                {selected.symbol === "JPM" || selected.symbol === "BRK.B" ? "NYSE" : "NASDAQ"}
              </span>
            </div>
            <div className="panel-heading-meta">
              <span className="tiny-label">CURRENCY: USD</span>
            </div>
          </div>

          <div className="asset-heading">
            <div className="asset-identity">
              <StockBadge stock={selected} />
              <div>
                <h3>
                  {selected.name} <span>{selected.symbol}</span>
                </h3>
                <p>
                  {selected.sector} <span>·</span> Cap {selected.marketCap} <span>·</span> Demo quote
                </p>
              </div>
            </div>

            <div className="asset-heading-controls">
              <Link
                href={`/dashboard/markets?symbol=${selected.symbol}`}
                className="button-secondary quick-market-link"
                title="Open in deep Market Explorer"
              >
                <span>Deep Analysis</span>
                <ArrowUpRight size={13} />
              </Link>
              <button
                type="button"
                className={`icon-button favorite-button ${
                  isWatchlisted(selected.symbol) ? "is-favorite" : ""
                }`}
                aria-label={`${
                  isWatchlisted(selected.symbol) ? "Remove" : "Add"
                } ${selected.symbol} ${
                  isWatchlisted(selected.symbol) ? "from" : "to"
                } watchlist`}
                aria-pressed={isWatchlisted(selected.symbol)}
                onClick={() => toggleWatchlist(selected.symbol)}
              >
                <Star size={18} />
              </button>
            </div>
          </div>

          <div className="asset-price">
            <strong>{money(selected.price)}</strong>
            <Change value={selected.change} />
            <span>today</span>
          </div>

          <div className="chart-toolbar">
            <div className="segmented timeframes" aria-label="Chart timeframe">
              {timeframes.map((period) => (
                <button
                  key={period}
                  type="button"
                  aria-pressed={timeframe === period}
                  className={timeframe === period ? "selected" : ""}
                  onClick={() => setTimeframe(period)}
                >
                  {period}
                </button>
              ))}
            </div>

            <div className="chart-options">
              <button
                type="button"
                className={volume ? "volume-toggle active" : "volume-toggle"}
                aria-pressed={volume}
                onClick={() => setVolume(!volume)}
              >
                <BarChart3 size={14} />
                <span>Volume</span>
              </button>

              <div className="segmented">
                <button
                  type="button"
                  className={chartType === "area" ? "selected" : ""}
                  aria-label="Area chart"
                  aria-pressed={chartType === "area"}
                  onClick={() => setChartType("area")}
                >
                  <ChartNoAxesCombined size={16} />
                </button>
                <button
                  type="button"
                  className={chartType === "candles" ? "selected" : ""}
                  aria-label="Candlestick chart"
                  aria-pressed={chartType === "candles"}
                  onClick={() => setChartType("candles")}
                >
                  <ChartCandlestick size={16} />
                </button>
              </div>
            </div>
          </div>

          <MarketChart
            key={`${selected.symbol}-${timeframe}`}
            data={data}
            type={chartType}
            volume={volume}
            symbol={selected.symbol}
          />

          <div className="chart-footer">
            <span>
              <span className="status-dot" /> Illustrative prices
            </span>
            <span>
              Volume <b>{selected.volume}</b>
            </span>
            <span>
              P/E <b>{selected.peRatio}</b>
            </span>
            <span className="chart-hint">Hover / scrub to inspect ticks</span>
          </div>
        </section>

        {/* Right: Watchlist Radar Panel */}
        <section className="panel watchlist-panel">
          <div className="panel-heading">
            <div className="section-title">
              <h2>Your watchlist</h2>
              <span className="count-badge">
                {watchlist.length}
                {!isPro && "/5"}
              </span>
            </div>
            <Link
              href="/dashboard/watchlist"
              className="watchlist-view-all"
              title="Open full Watchlist manager"
            >
              Full list <ArrowUpRight size={13} />
            </Link>
          </div>

          <label className="stock-search">
            <Search size={15} />
            <input
              aria-label="Search stocks"
              placeholder="Find a symbol or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear stock search"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </label>

          <div className="watchlist-columns">
            <span>ASSET</span>
            <span>PRICE / CHANGE</span>
          </div>

          <div className="stock-list">
            {(query
              ? results
              : stocks.filter((stock) => watchlist.includes(stock.symbol))
            ).map((stock) => (
              <button
                type="button"
                className={`stock-row ${
                  selected.symbol === stock.symbol ? "selected" : ""
                }`}
                key={stock.symbol}
                onClick={() => pickStock(stock)}
                aria-pressed={selected.symbol === stock.symbol}
              >
                <StockBadge stock={stock} />
                <span className="stock-name">
                  <b>{stock.symbol}</b>
                  <small>{stock.name}</small>
                </span>
                <Sparkline
                  seed={stocks.indexOf(stock) + 1}
                  negative={stock.change < 0}
                />
                <span className="stock-values">
                  <b>{money(stock.price)}</b>
                  <small className={stock.change > 0 ? "positive" : "negative"}>
                    {signed(stock.change)}
                  </small>
                </span>
              </button>
            ))}

            {(query ? results.length === 0 : watchlist.length === 0) && (
              <div className="empty-state">
                <Search size={24} />
                <b>{query ? "No matching stocks" : "Your radar is clear"}</b>
                <p>
                  {query
                    ? "Try NVDA, Apple, or Microsoft."
                    : "Star an asset from the market list to add it to your watchlist."}
                </p>
              </div>
            )}
          </div>

          <div className="watchlist-bottom">
            <span>
              <span className="status-dot" />{" "}
              {query
                ? `${results.length} matching assets`
                : `${watchlist.length} assets tracked`}
            </span>
            {!isPro && (
              <button
                type="button"
                className="watchlist-limit-upgrade-link"
                onClick={() => openPricingModal("watchlist_limit")}
              >
                Unlock Unlimited ↗
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Portfolio Summary Strip */}
      <section className="portfolio-strip">
        <div className="portfolio-intro">
          <span className="portfolio-icon">
            <Wallet size={20} />
          </span>
          <div>
            <span className="tiny-label">DEMO PORTFOLIO SNAPSHOT</span>
            <h2>Built for the long view.</h2>
          </div>
        </div>
        <div>
          <span className="metric-label">Portfolio value</span>
          <strong>
            $124,582<span>.80</span>
          </strong>
        </div>
        <div>
          <span className="metric-label">Total return</span>
          <strong className="positive">+$19,556.40</strong>
          <small className="positive">↗ 18.62% all time</small>
        </div>
        <div>
          <span className="metric-label">Today’s return</span>
          <strong>+$1,428.62</strong>
          <small className="positive">↗ 1.16% today</small>
        </div>
        <div className="portfolio-mini">
          <Link href="/dashboard/portfolio" className="portfolio-full-link">
            <span>Inspect Portfolio</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Insights Grid */}
      <div className="insights-grid">
        {/* Market Pulse Heatmap */}
        <section className="panel heatmap-panel">
          <div className="panel-heading">
            <div className="section-title">
              <span className="red-marker" />
              <h2>Market pulse</h2>
            </div>
            <span className="tiny-label">BY RELATIVE WEIGHT</span>
          </div>
          <div className="heatmap">
            {stocks.slice(0, 7).map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                className={`heat-tile heat-${stock.symbol} ${
                  stock.change > 0 ? "up" : "down"
                }`}
                onClick={() => pickStock(stock)}
                aria-label={`View ${stock.symbol}, ${signed(stock.change)}`}
              >
                <b>{stock.symbol}</b>
                <span>{signed(stock.change)}</span>
              </button>
            ))}
          </div>
          <div className="heatmap-legend">
            <span>−3%</span>
            <div />
            <span>+3%</span>
            <small>Sample daily change</small>
          </div>
        </section>

        {/* Asset Allocation */}
        <section className="panel allocation-panel">
          <div className="panel-heading">
            <div className="section-title">
              <h2>Asset allocation</h2>
            </div>
            <span className="tiny-label">DEMO HOLDINGS</span>
          </div>
          <div className="allocation-content">
            <div
              className="allocation-donut"
              role="img"
              aria-label="Demo allocation: stocks 62%, ETFs 23%, bonds 10%, cash 5%"
            >
              <div>
                <span>4</span>
                <small>ASSET CLASSES</small>
              </div>
            </div>
            <div className="allocation-legend">
              {[
                ["Stocks", 62, "#e11d35"],
                ["ETFs", 23, "#a84755"],
                ["Bonds", 10, "#db9da6"],
                ["Cash", 5, "#5d616a"],
              ].map(([label, percent, color]) => (
                <div key={label}>
                  <i style={{ background: color }} />
                  <span>{label}</span>
                  <b>{percent}%</b>
                </div>
              ))}
            </div>
          </div>
          <p className="allocation-caption">
            Different assets. One bigger picture.
          </p>
        </section>

        {/* Market Movers */}
        <section className="panel movers-panel">
          <div className="panel-heading">
            <div className="section-title">
              <h2>Market movers</h2>
            </div>
            <Activity size={15} className="muted" />
          </div>
          <div className="segmented mover-tabs">
            <button
              type="button"
              className={movers === "gainers" ? "selected" : ""}
              aria-pressed={movers === "gainers"}
              onClick={() => setMovers("gainers")}
            >
              <ArrowUpRight size={13} /> Top gainers
            </button>
            <button
              type="button"
              className={movers === "losers" ? "selected" : ""}
              aria-pressed={movers === "losers"}
              onClick={() => setMovers("losers")}
            >
              <ArrowDownRight size={13} /> Top losers
            </button>
          </div>
          {movement.map((stock, i) => (
            <button
              type="button"
              className="mover-row"
              key={stock.symbol}
              onClick={() => pickStock(stock)}
            >
              <span className="mover-rank">0{i + 1}</span>
              <StockBadge stock={stock} />
              <span>
                <b>{stock.symbol}</b>
                <small>{stock.name}</small>
              </span>
              <Change value={stock.change} />
            </button>
          ))}
        </section>
      </div>

      {/* Premium Insights Contextual Teasers (Requirement 1 & 2) */}
      <section className="overview-pro-insights-section">
        <div className="section-header-row">
          <div className="section-title">
            <span className="red-marker" />
            <h2>Institutional Intelligence Modules</h2>
            <span className="subtle-tag">PRO SUITE PREVIEW</span>
          </div>
          <span className="muted">
            High-frequency order flow and predictive sentiment telemetry.
          </span>
        </div>

        <div className="pro-insights-grid">
          {/* Module 1: Algorithmic Dark Pool & Order Flow */}
          <section className="panel order-flow-panel">
            <div className="panel-heading">
              <div className="section-title">
                <Layers size={16} className="red-text" />
                <h3>Institutional Dark Pool & Block Flow</h3>
              </div>
              <span className="subtle-tag">LIVE TRACER</span>
            </div>

            <PremiumGate
              featureName="Institutional Dark Pool & Block Flow"
              description="Monitor off-exchange block trades, institutional accumulation blocks, and hidden liquidity clusters across tier-1 execution venues."
              benefits={[
                "Off-exchange dark pool print volume detection",
                "Option sweep order flow with delta-adjusted notionals",
                "Real-time institutional liquidity imbalance meter",
              ]}
              source="order_flow_teaser"
            >
              <div className="order-flow-demo-content">
                <div className="flow-stats-row">
                  <div>
                    <span>Dark Pool Ratio</span>
                    <strong>48.6%</strong>
                    <small className="positive">+3.4% above 30D avg</small>
                  </div>
                  <div>
                    <span>Block Print Volume</span>
                    <strong>$1.42B</strong>
                    <small>18 major prints &gt; $50M</small>
                  </div>
                  <div>
                    <span>Order Imbalance</span>
                    <strong className="positive">+62% Buy Skew</strong>
                    <small className="positive">Aggressive accumulation</small>
                  </div>
                </div>

                <div className="flow-table-teaser">
                  <div className="flow-row">
                    <span>15:42:01</span>
                    <b>NVDA</b>
                    <span className="flow-type buy">BLOCK BUY</span>
                    <span>245,000 shares @ $142.90</span>
                    <b>$35.01M</b>
                  </div>
                  <div className="flow-row">
                    <span>15:38:19</span>
                    <b>AAPL</b>
                    <span className="flow-type buy">DARK POOL PRINT</span>
                    <span>180,000 shares @ $228.15</span>
                    <b>$41.06M</b>
                  </div>
                  <div className="flow-row">
                    <span>15:31:04</span>
                    <b>MSFT</b>
                    <span className="flow-type neutral">SWEEP</span>
                    <span>65,000 shares @ $428.50</span>
                    <b>$27.85M</b>
                  </div>
                </div>
              </div>
            </PremiumGate>
          </section>

          {/* Module 2: AI Macro Sentiment Forecast */}
          <section className="panel ai-sentiment-panel">
            <div className="panel-heading">
              <div className="section-title">
                <TrendingUp size={16} className="red-text" />
                <h3>Quantitative Trend Probability Engine</h3>
              </div>
              <span className="subtle-tag">AI INFERENCE</span>
            </div>

            <PremiumGate
              featureName="AI Quantitative Regime & Sentiment Forecast"
              description="Continuous machine learning inference evaluating 40+ macroeconomic factors, options gamma skew, and earnings call transcript sentiment."
              benefits={[
                "Multi-horizon volatility regime forecasting (5D / 20D / 60D)",
                "Systematic momentum & mean-reversion scoring",
                "Automated risk-off regime change trigger alerts",
              ]}
              source="ai_sentiment_teaser"
            >
              <div className="sentiment-demo-content">
                <div className="sentiment-score-row">
                  <div className="sentiment-gauge-card">
                    <span>CURRENT REGIME</span>
                    <strong>Expansionary Momentum</strong>
                    <div className="probability-bar">
                      <div className="bar-fill" style={{ width: "78%" }} />
                    </div>
                    <small>78% probability of trend continuation</small>
                  </div>

                  <div className="sentiment-factors-list">
                    <div className="factor-item">
                      <span>Options Gamma Skew</span>
                      <b className="positive">Call Bias (+1.4σ)</b>
                    </div>
                    <div className="factor-item">
                      <span>Systematic Vol Inflows</span>
                      <b className="positive">Elevated Re-leveraging</b>
                    </div>
                    <div className="factor-item">
                      <span>Credit Spread Health</span>
                      <b className="positive">Tight (Low Default Risk)</b>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumGate>
          </section>
        </div>
      </section>

      {/* Briefing Section */}
      <section id="briefing" className="briefing">
        <div className="briefing-heading">
          <div className="section-title">
            <span className="red-marker" />
            <h2>The market briefing</h2>
            <span className="subtle-tag">SAMPLE EDITORIAL</span>
          </div>
          <Link href="/dashboard/market-briefing" className="briefing-hub-link">
            <span>Explore All Research Briefings</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="news-grid">
          {news.slice(0, 3).map((item, i) => (
            <button
              key={item.title}
              type="button"
              className="news-card"
              onClick={() => {
                setArticle(item);
                dialogRef.current?.showModal();
              }}
            >
              <div className={`news-art news-art-${i}`} aria-hidden="true">
                {i === 0 ? (
                  <ChartNoAxesCombined />
                ) : i === 1 ? (
                  <span className="chip-art">AI</span>
                ) : (
                  <Globe2 />
                )}
                <span className="news-art-lines" />
              </div>
              <div className="news-copy">
                <span className="tiny-label">{item.category}</span>
                <h3>{item.title}</h3>
                <div>
                  <span>
                    Redline Research <span>·</span> {item.readTime || item.time}
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>
          <span className="status-dot" /> ALL SYSTEMS ILLUSTRATIVE
        </span>
        <p>
          Demo Data · Sample prices, portfolio, and editorial. No live market
          execution.
        </p>
        <span>
          REDLINE TERMINAL <span className="red-text">↗</span>
        </span>
      </footer>

      {/* Article Dialog */}
      <dialog
        ref={dialogRef}
        className="news-dialog"
        aria-labelledby="article-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="dialog-header">
          <Brand />
          <button
            type="button"
            className="icon-button"
            aria-label="Close article"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={21} />
          </button>
        </div>
        <span className="eyebrow red-text">
          {article.category} · DEMO EDITORIAL
        </span>
        <h2 id="article-title">{article.title}</h2>
        <p>{article.body}</p>
        <div className="dialog-footer">
          <span>
            {article.author || "Redline Research"} · {article.readTime || article.time}
          </span>
          <button
            type="button"
            className="button-secondary"
            onClick={() => dialogRef.current?.close()}
          >
            Back to terminal <ArrowRight size={15} />
          </button>
        </div>
      </dialog>
    </>
  );
}
