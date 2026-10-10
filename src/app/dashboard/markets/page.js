"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChartCandlestick,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  Layers,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import {
  makeSeries,
  money,
  sectors,
  signed,
  stocks,
  timeframes,
} from "@/lib/market-data";
import MarketChart, { Sparkline } from "@/components/redline/market-chart";
import { useDashboard } from "@/context/dashboard-context";
import {
  PremiumGate,
  ProFeaturePreview,
  UpgradeButton,
} from "@/components/redline/premium-gate";
import TechnicalIndicatorChart from "@/components/redline/technical-indicator-chart";
import StockComparisonChart from "@/components/redline/stock-comparison-chart";

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

export default function MarketsPage() {
  const {
    isPro,
    authorizePro,
    toggleWatchlist,
    isWatchlisted,
    openPricingModal,
    setNotice,
  } = useDashboard();

  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [timeframe, setTimeframe] = useState("1M");
  const [chartType, setChartType] = useState("area");
  const [volume, setVolume] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortField, setSortField] = useState("marketCap"); // "symbol" | "price" | "change" | "volume" | "marketCap" | "rsi"
  const [sortAsc, setSortAsc] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [comparisonActive, setComparisonActive] = useState(false);

  // Filter & Sort
  const filteredStocks = useMemo(() => {
    let list = stocks.filter((stock) => {
      const matchesSearch =
        `${stock.symbol} ${stock.name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesSector =
        selectedSector === "All" || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "marketCap") {
        const parseCap = (c) =>
          parseFloat(c.replace("$", "").replace("T", "000").replace("B", ""));
        valA = parseCap(a.marketCap);
        valB = parseCap(b.marketCap);
      } else if (sortField === "volume") {
        valA = parseFloat(a.volume.replace("M", ""));
        valB = parseFloat(b.volume.replace("M", ""));
      }

      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [searchQuery, selectedSector, sortField, sortAsc]);

  const seriesData = useMemo(
    () => makeSeries(selectedStock, timeframe),
    [selectedStock, timeframe]
  );

  function handleSort(field) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  }

  function exportMarketData() {
    const csv =
      `Symbol,Name,Sector,Price,ChangePct,Volume,MarketCap,PE,Beta,RSI,Signal\n` +
      filteredStocks
        .map(
          (s) =>
            `"${s.symbol}","${s.name}","${s.sector}",${s.price},${s.change},"${s.volume}","${s.marketCap}",${s.peRatio},${s.beta},${s.rsi},"${s.signal}"`
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `redline-market-screener-demo.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Market screener data exported to CSV.");
  }

  return (
    <div className="markets-page enter">
      {/* Header */}
      <section className="overview-heading">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> EQUITIES DISCOVERY & TECHNICAL TERMINAL
          </span>
          <h1>
            Market Explorer. <span>In detail.</span>
          </h1>
          <p>
            Interactive stock screener, technical oscillators, and comparative
            momentum tracking across major exchanges.
          </p>
        </div>

        <div className="overview-heading-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={exportMarketData}
          >
            <Download size={14} /> Export Screener <ArrowUpRight size={13} />
          </button>
        </div>
      </section>

      {/* Screener Controls: Search & Sector Tabs */}
      <div className="screener-controls-bar">
        <label className="screener-search">
          <Search size={15} />
          <input
            placeholder="Search by symbol or company name (e.g. NVDA, Apple, Broadcom)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </label>

        <div className="sector-tabs" role="tablist">
          {sectors.map((sec) => (
            <button
              key={sec}
              type="button"
              role="tab"
              aria-selected={selectedSector === sec}
              className={`sector-tab ${selectedSector === sec ? "active" : ""}`}
              onClick={() => setSelectedSector(sec)}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Stock Table */}
      <section className="panel market-table-panel">
        <div className="panel-heading">
          <div className="section-title">
            <span className="red-marker" />
            <h2>Equities Screener</h2>
            <span className="count-badge">{filteredStocks.length} assets</span>
          </div>
          <span className="tiny-label">DEMO DATA · SORTABLE</span>
        </div>

        <div className="market-table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("symbol")}>
                  <div className="th-content">
                    <span>ASSET</span>
                    {sortField === "symbol" && (
                      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
                <th>SECTOR</th>
                <th onClick={() => handleSort("price")}>
                  <div className="th-content right">
                    <span>PRICE</span>
                    {sortField === "price" && (
                      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort("change")}>
                  <div className="th-content right">
                    <span>24H CHANGE</span>
                    {sortField === "change" && (
                      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort("volume")}>
                  <div className="th-content right">
                    <span>VOLUME</span>
                    {sortField === "volume" && (
                      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort("marketCap")}>
                  <div className="th-content right">
                    <span>MARKET CAP</span>
                    {sortField === "marketCap" && (
                      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
                <th>P/E</th>
                <th onClick={() => handleSort("rsi")}>
                  <div className="th-content right">
                    <span>RSI (14)</span>
                    {sortField === "rsi" && (
                      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
                <th>SIGNAL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => {
                const isSelected = selectedStock.symbol === stock.symbol;
                const isSaved = isWatchlisted(stock.symbol);

                return (
                  <tr
                    key={stock.symbol}
                    className={`table-row ${isSelected ? "selected-row" : ""}`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <td>
                      <div className="table-asset-cell">
                        <StockBadge stock={stock} />
                        <div>
                          <b>{stock.symbol}</b>
                          <small>{stock.name}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sector-tag">{stock.sector}</span>
                    </td>
                    <td className="text-right">
                      <b>{money(stock.price)}</b>
                    </td>
                    <td className="text-right">
                      <span
                        className={`change-tag ${
                          stock.change >= 0 ? "positive" : "negative"
                        }`}
                      >
                        {signed(stock.change)}
                      </span>
                    </td>
                    <td className="text-right muted">{stock.volume}</td>
                    <td className="text-right">
                      <b>{stock.marketCap}</b>
                    </td>
                    <td className="text-right muted">{stock.peRatio}</td>
                    <td className="text-right">
                      <span
                        className={`rsi-pill ${
                          stock.rsi >= 70
                            ? "rsi-high"
                            : stock.rsi <= 35
                            ? "rsi-low"
                            : "rsi-mid"
                        }`}
                      >
                        {stock.rsi}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`signal-badge signal-${stock.signal
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {stock.signal}
                      </span>
                    </td>
                    <td>
                      <div
                        className="table-actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className={`icon-button ${isSaved ? "is-favorite" : ""}`}
                          aria-label={`${
                            isSaved ? "Remove from" : "Add to"
                          } watchlist`}
                          onClick={() => toggleWatchlist(stock.symbol)}
                          title={`${isSaved ? "Starred" : "Star to add to watchlist"}`}
                        >
                          <Star size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Selected Stock Deep Inspection Panel */}
      <section className="panel asset-inspector-panel">
        <div className="panel-heading">
          <div className="section-title">
            <span className="red-marker" />
            <h2>Asset Analysis: {selectedStock.name} ({selectedStock.symbol})</h2>
            <span className="subtle-tag">{selectedStock.sector}</span>
          </div>
          <div className="inspector-top-actions">
            <button
              type="button"
              className={`button-secondary ${comparisonActive ? "active" : ""}`}
              onClick={async () => { if (await authorizePro("market_comparison")) setComparisonActive(!comparisonActive); }}
            >
              <Layers size={14} />
              <span>Compare Stocks</span>
              {!isPro && <Sparkles size={11} className="red-text" />}
            </button>
            <button
              type="button"
              className={`button-secondary ${showIndicators ? "active" : ""}`}
              onClick={async () => { if (await authorizePro("market_indicators")) setShowIndicators(!showIndicators); }}
            >
              <Activity size={14} />
              <span>RSI & Indicators</span>
            </button>
          </div>
        </div>

        {/* Fundamental Quick Stats Grid */}
        <div className="fundamental-stats-grid">
          <div className="fstat-card">
            <span>Market Price</span>
            <strong>{money(selectedStock.price)}</strong>
            <small
              className={selectedStock.change >= 0 ? "positive" : "negative"}
            >
              {signed(selectedStock.change)} 24H
            </small>
          </div>
          <div className="fstat-card">
            <span>Market Cap</span>
            <strong>{selectedStock.marketCap}</strong>
            <small className="muted">Large-Cap Core</small>
          </div>
          <div className="fstat-card">
            <span>P/E Ratio</span>
            <strong>{selectedStock.peRatio}</strong>
            <small className="muted">Trailing 12M</small>
          </div>
          <div className="fstat-card">
            <span>52W Range</span>
            <strong>
              ${selectedStock.low52} — ${selectedStock.high52}
            </strong>
            <small className="muted">Current: ${selectedStock.price}</small>
          </div>
          <div className="fstat-card">
            <span>Beta vs S&P</span>
            <strong>{selectedStock.beta}</strong>
            <small className="muted">
              {selectedStock.beta > 1.2 ? "High Volatility" : "Moderate Risk"}
            </small>
          </div>
          <div className="fstat-card">
            <span>Analyst Target</span>
            <strong className="positive">${selectedStock.analystTarget}</strong>
            <small className="positive">
              ↗{" "}
              {(
                ((selectedStock.analystTarget - selectedStock.price) /
                  selectedStock.price) *
                100
              ).toFixed(1)}
              % Upside
            </small>
          </div>
        </div>

        {/* Primary Interactive Chart */}
        <div className="inspector-chart-container">
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
                  onClick={() => setChartType("area")}
                >
                  <ChartNoAxesCombined size={16} />
                </button>
                <button
                  type="button"
                  className={chartType === "candles" ? "selected" : ""}
                  aria-label="Candlestick chart"
                  onClick={() => setChartType("candles")}
                >
                  <ChartCandlestick size={16} />
                </button>
              </div>
            </div>
          </div>

          <MarketChart
            key={`${selectedStock.symbol}-${timeframe}`}
            data={seriesData}
            type={chartType}
            volume={volume}
            symbol={selectedStock.symbol}
          />
        </div>

        {/* Technical Oscillator Panel */}
        {isPro && showIndicators && (
          <div className="inspector-indicator-section">
            <div className="section-title">
              <span className="red-marker" />
              <h3>Technical Oscillators & Relative Strength</h3>
            </div>
            <TechnicalIndicatorChart
              data={seriesData}
              symbol={selectedStock.symbol}
            />
          </div>
        )}

        {/* Pro Feature: Multi-Asset Performance Comparison */}
        {isPro && comparisonActive && (
          <div className="inspector-comparison-section">
            <div className="section-title">
              <Layers size={16} className="red-text" />
              <h3>Multi-Asset Performance Comparison</h3>
              <span className="subtle-tag">PRO MODULE</span>
            </div>

            <PremiumGate
              featureName="Multi-Asset Stock Comparison & Spread Engine"
              description="Overlay up to 4 assets on a normalized percentage curve to spot relative strength divergence, correlation shifts, and sector rotation."
              benefits={[
                "Normalized % return overlay across customizable time horizons",
                "Cross-asset correlation matrix and beta spread analysis",
                "Export comparative tick history to CSV and audit PDFs",
              ]}
              source="stock_comparison"
            >
              <StockComparisonChart
                baseStock={selectedStock}
                compareStocks={stocks.filter((s) => s.symbol !== selectedStock.symbol).slice(0, 2)}
                timeframe={timeframe}
              />
            </PremiumGate>
          </div>
        )}
      </section>

      {/* Pro Feature: Volatility & Quantitative Screener */}
      <section className="panel pro-screener-panel">
        <div className="panel-heading">
          <div className="section-title">
            <Zap size={16} className="red-text" />
            <h2>Quantitative Factor Models & Implied Volatility Surface</h2>
          </div>
          <span className="subtle-tag">INSTITUTIONAL QUANT</span>
        </div>

        <PremiumGate
          featureName="Quantitative Factor Models & Implied Volatility Surface"
          description="Access multi-factor Fama-French style exposure models, 30-day implied volatility percentiles, and institutional short interest diagnostics."
          benefits={[
            "30-day Implied Volatility (IV) percentile rank vs historical realized vol",
            "Institutional block ownership and 13F insider accumulation trackers",
            "Factor sensitivities: Momentum, Value, Quality, and Beta exposures",
          ]}
          source="quant_screener"
        >
          <div className="quant-preview-content">
            <div className="quant-metrics-grid">
              <div className="quant-card">
                <span>IV Percentile (30D)</span>
                <strong>42% (Normal)</strong>
                <small className="positive">Options premiums fair</small>
              </div>
              <div className="quant-card">
                <span>Institutional Ownership</span>
                <strong>84.2%</strong>
                <small>Top holder: Vanguard / BlackRock</small>
              </div>
              <div className="quant-card">
                <span>Short % of Float</span>
                <strong>1.8%</strong>
                <small className="positive">Low short squeeze risk</small>
              </div>
              <div className="quant-card">
                <span>Quality Factor Score</span>
                <strong className="positive">94 / 100</strong>
                <small>High ROIC & Free Cash Flow</small>
              </div>
            </div>
          </div>
        </PremiumGate>
      </section>
    </div>
  );
}

