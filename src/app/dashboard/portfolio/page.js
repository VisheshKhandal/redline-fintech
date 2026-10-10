"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  PieChart,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import {
  demoPortfolio,
  makePortfolioSeries,
  money,
  signed,
  stocks,
} from "@/lib/market-data";
import { useDashboard } from "@/context/dashboard-context";
import {
  PremiumGate,
  ProFeaturePreview,
  UpgradeButton,
} from "@/components/redline/premium-gate";

function StockBadge({ symbol, color }) {
  return (
    <span
      className="stock-badge"
      style={{ "--stock-color": color || "#888" }}
    >
      {symbol === "AAPL" ? "a" : symbol.slice(0, 1)}
    </span>
  );
}

export default function PortfolioPage() {
  const { isPro, openPricingModal, setNotice, authorizePro, premiumData } = useDashboard();
  const [timeframe, setTimeframe] = useState("1Y");
  const [activeChartPoint, setActiveChartPoint] = useState(null);

  const series = useMemo(() => makePortfolioSeries(timeframe), [timeframe]);
  const activePoint =
    activeChartPoint === null
      ? series[series.length - 1]
      : series[activeChartPoint];

  // SVG dimensions for equity curve
  const width = 840;
  const height = 240;
  const left = 55;
  const right = 20;
  const top = 20;
  const bottom = 32;

  const minVal = Math.min(...series.map((d) => Math.min(d.value, d.benchmark))) * 0.98;
  const maxVal = Math.max(...series.map((d) => Math.max(d.value, d.benchmark))) * 1.02;

  const x = (i) => left + (i / (series.length - 1)) * (width - left - right);
  const y = (v) => top + ((maxVal - v) / (maxVal - minVal)) * (height - top - bottom);

  const portfolioLine = series
    .map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`)
    .join(" ");

  const benchmarkLine = series
    .map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.benchmark)}`)
    .join(" ");

  function exportHoldings() {
    const csv =
      `Symbol,Name,AssetClass,Sector,Shares,AvgBuyPrice,CurrentPrice,MarketValue,UnrealizedReturn,ReturnPct,Weight\n` +
      demoPortfolio.holdings
        .map(
          (h) =>
            `"${h.symbol}","${h.name}","${h.assetClass}","${h.sector}",${h.shares},${h.avgBuyPrice},${h.currentPrice},${h.marketValue},${h.unrealizedReturn},${h.returnPercent},${h.allocation}`
        )
        .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `redline-portfolio-holdings.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Portfolio holdings exported to CSV.");
  }

  async function handleReportExport() {
    if (!isPro) {
      openPricingModal("portfolio_report_export");
      return;
    }
    const data = await authorizePro("portfolio_report_export");
    if (!data) return;
    const url = URL.createObjectURL(new Blob([data.report], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "redline-pro-report.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Demo portfolio report downloaded.");
  }

  return (
    <div className="portfolio-page enter">
      {/* Header */}
      <section className="overview-heading">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> ASSET PERFORMANCE & RISK ALLOCATION
          </span>
          <h1>
            Portfolio. <span>Long-term view.</span>
          </h1>
          <p>
            Track real-time equity growth, capital distribution, factor loadings,
            and institutional drawdown stress tests.
          </p>
        </div>

        <div className="overview-heading-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={exportHoldings}
          >
            <Download size={14} /> Export Holdings <ArrowUpRight size={13} />
          </button>
        </div>
      </section>

      {/* Top Metric Cards Strip */}
      <section className="portfolio-stats-strip">
        <div className="pstat-card primary-card">
          <span className="pstat-label">TOTAL PORTFOLIO VALUE</span>
          <strong>${demoPortfolio.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
          <small className="positive">
            ↗ +${demoPortfolio.todayReturnDollars.toLocaleString()} (+{demoPortfolio.todayReturnPercent}%) today
          </small>
        </div>

        <div className="pstat-card">
          <span className="pstat-label">TOTAL UNREALIZED RETURN</span>
          <strong className="positive">
            +${demoPortfolio.totalReturnDollars.toLocaleString()}
          </strong>
          <small className="positive">↗ {demoPortfolio.totalReturnPercent}% all-time gain</small>
        </div>

        <div className="pstat-card">
          <span className="pstat-label">INVESTED CAPITAL</span>
          <strong>${demoPortfolio.investedCapital.toLocaleString()}</strong>
          <small className="muted">Net contributions</small>
        </div>

        <div className="pstat-card">
          <span className="pstat-label">CASH RESERVES</span>
          <strong>${demoPortfolio.cashBalance.toLocaleString()}</strong>
          <small className="muted">5.0% Liquidity allocation</small>
        </div>
      </section>

      {/* Historical Equity Curve vs Benchmark */}
      <section className="panel portfolio-chart-panel">
        <div className="panel-heading">
          <div className="section-title">
            <span className="red-marker" />
            <h2>Historical Equity Curve vs Benchmark (S&P 500)</h2>
          </div>

          <div className="segmented timeframes">
            {["1M", "3M", "6M", "1Y", "YTD", "ALL"].map((p) => (
              <button
                key={p}
                type="button"
                className={timeframe === p ? "selected" : ""}
                onClick={() => setTimeframe(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="portfolio-chart-readout">
          <div className="readout-left">
            <span>{activePoint.label}</span>
            <b className="portfolio-val-highlight">
              ${activePoint.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </b>
            <span className="benchmark-tag">
              SPX Benchmark: ${activePoint.benchmark.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="chart-legend-pills">
            <span className="legend-item red">
              <i /> Portfolio Equity
            </span>
            <span className="legend-item gray">
              <i /> S&P 500 Index
            </span>
          </div>
        </div>

        <div className="portfolio-chart-canvas">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Portfolio equity curve"
            onMouseLeave={() => setActiveChartPoint(null)}
          >
            <defs>
              <linearGradient id="equity-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e11d35" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#e11d35" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {Array.from({ length: 4 }, (_, i) => {
              const val = minVal + ((maxVal - minVal) * i) / 3;
              return (
                <g key={i}>
                  <line
                    x1={left}
                    x2={width - right}
                    y1={y(val)}
                    y2={y(val)}
                    stroke="#22242a"
                    strokeDasharray="3 4"
                  />
                  <text
                    x={left - 8}
                    y={y(val) + 3}
                    textAnchor="end"
                    fill="#6e707d"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    ${(val / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* Benchmark line */}
            <path
              d={benchmarkLine}
              fill="none"
              stroke="#595c69"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />

            {/* Portfolio line & fill */}
            <path
              d={`${portfolioLine} L${x(series.length - 1)},${height - bottom} L${left},${height - bottom} Z`}
              fill="url(#equity-fill)"
            />
            <path
              d={portfolioLine}
              fill="none"
              stroke="#f04a60"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Active pointer */}
            {activeChartPoint !== null && (
              <g>
                <line
                  x1={x(activeChartPoint)}
                  x2={x(activeChartPoint)}
                  y1={top}
                  y2={height - bottom}
                  stroke="#9899a6"
                  strokeDasharray="2 3"
                />
                <circle
                  cx={x(activeChartPoint)}
                  cy={y(activePoint.value)}
                  r="4"
                  fill="#f04a60"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* Hit testing rects */}
            {series.map((_, i) => (
              <rect
                key={i}
                x={x(i) - (width - left - right) / series.length / 2}
                y={top}
                width={(width - left - right) / series.length}
                height={height - top - bottom}
                fill="transparent"
                onMouseEnter={() => setActiveChartPoint(i)}
              />
            ))}

            {/* X-axis labels */}
            {[0, 9, 18, 27, 35].map((idx) => (
              <text
                key={idx}
                x={x(idx)}
                y={height - 10}
                textAnchor="middle"
                fill="#6e707d"
                fontSize="9"
                fontFamily="monospace"
              >
                {series[idx]?.label}
              </text>
            ))}
          </svg>
        </div>
      </section>

      {/* Holdings Table */}
      <section className="panel holdings-panel">
        <div className="panel-heading">
          <div className="section-title">
            <span className="red-marker" />
            <h2>Current Holdings & Unrealized Returns</h2>
            <span className="count-badge">{demoPortfolio.holdings.length} assets</span>
          </div>
          <span className="tiny-label">PORTFOLIO WEIGHTING</span>
        </div>

        <div className="market-table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th>HOLDING</th>
                <th>CLASS</th>
                <th className="text-right">SHARES</th>
                <th className="text-right">AVG COST</th>
                <th className="text-right">PRICE</th>
                <th className="text-right">MARKET VALUE</th>
                <th className="text-right">UNREALIZED RETURN</th>
                <th className="text-right">WEIGHT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {demoPortfolio.holdings.map((h) => {
                const stockObj = stocks.find((s) => s.symbol === h.symbol);
                const color = stockObj ? stockObj.color : "#999";

                return (
                  <tr key={h.symbol} className="table-row">
                    <td>
                      <div className="table-asset-cell">
                        <StockBadge symbol={h.symbol} color={color} />
                        <div>
                          <b>{h.symbol}</b>
                          <small>{h.name}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sector-tag">{h.assetClass}</span>
                    </td>
                    <td className="text-right">{h.shares}</td>
                    <td className="text-right muted">{money(h.avgBuyPrice)}</td>
                    <td className="text-right">
                      <b>{money(h.currentPrice)}</b>
                    </td>
                    <td className="text-right">
                      <b>${h.marketValue.toLocaleString()}</b>
                    </td>
                    <td className="text-right">
                      <div className="return-cell">
                        <b
                          className={h.unrealizedReturn >= 0 ? "positive" : "negative"}
                        >
                          {h.unrealizedReturn >= 0 ? "+" : ""}
                          ${h.unrealizedReturn.toFixed(2)}
                        </b>
                        <small
                          className={h.returnPercent >= 0 ? "positive" : "negative"}
                        >
                          {signed(h.returnPercent)}
                        </small>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="weight-cell">
                        <span>{h.allocation}%</span>
                        <div className="weight-mini-bar">
                          <div
                            className="weight-fill"
                            style={{ width: `${h.allocation * 3}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/markets?symbol=${h.symbol}`}
                        className="quick-chart-link"
                      >
                        Inspect <ArrowUpRight size={11} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Allocation Visualizer & Sector Distribution */}
      <div className="portfolio-allocation-grid">
        {/* Asset Class Distribution */}
        <section className="panel asset-class-panel">
          <div className="panel-heading">
            <div className="section-title">
              <PieChart size={16} className="red-text" />
              <h3>Asset Class Distribution</h3>
            </div>
            <span className="subtle-tag">4 CLASSES</span>
          </div>

          <div className="allocation-content">
            <div
              className="allocation-donut"
              role="img"
              aria-label="Demo allocation: stocks 62%, ETFs 23%, bonds 10%, cash 5%"
            >
              <div>
                <span>4</span>
                <small>CLASSES</small>
              </div>
            </div>
            <div className="allocation-legend">
              {demoPortfolio.allocations.map((a) => (
                <div key={a.label}>
                  <i style={{ background: a.color }} />
                  <span>{a.label}</span>
                  <b>{a.percent}%</b>
                  <small className="muted">{a.value}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sector Exposure Progress Breakdown */}
        <section className="panel sector-exposure-panel">
          <div className="panel-heading">
            <div className="section-title">
              <BarChart2 size={16} className="red-text" />
              <h3>Sector Concentration</h3>
            </div>
            <span className="subtle-tag">FACTOR LOADINGS</span>
          </div>

          <div className="sector-bars-list">
            {demoPortfolio.sectorAllocations.map((sec) => (
              <div key={sec.sector} className="sector-bar-row">
                <div className="sector-bar-info">
                  <span>{sec.sector}</span>
                  <b>{sec.percent}%</b>
                </div>
                <div className="sector-progress-bg">
                  <div
                    className="sector-progress-fill"
                    style={{
                      width: `${sec.percent}%`,
                      backgroundColor: sec.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Pro Feature 1: Institutional Risk Analytics & Stress Testing */}
      <section className="panel portfolio-risk-panel">
        <div className="panel-heading">
          <div className="section-title">
            <ShieldAlert size={16} className="red-text" />
            <h2>Institutional Risk Engine & Scenario Stress Testing</h2>
          </div>
          <span className="subtle-tag">PRO SUITE</span>
        </div>

        <PremiumGate
          featureName="Institutional Risk Engine & Stress Testing"
          description="Evaluate portfolio resilience against historical market drawdowns, compute parametric Value at Risk (VaR), and inspect Sharpe and Sortino ratios."
          benefits={[
            "Parametric 95% & 99% Value at Risk (1-Day and 10-Day holding periods)",
            "Full crisis scenario replay: 2008 Subprime, 2020 Liquidity, 2022 Rates",
            "Sharpe Ratio (1.84) & Beta (1.12) decomposition against MSCI World",
          ]}
          source="portfolio_risk_engine"
        >
          <div className="risk-engine-content">
            {/* Risk Metrics Cards */}
            <div className="risk-metrics-row">
              <div className="risk-metric-box">
                <span>SHARPE RATIO</span>
                <strong className="positive">
                  {premiumData?.risk?.sharpeRatio}
                </strong>
                <small className="positive">Top decile risk-adjusted return</small>
              </div>
              <div className="risk-metric-box">
                <span>SORTINO RATIO</span>
                <strong className="positive">
                  {premiumData?.risk?.sortinoRatio}
                </strong>
                <small>Downside deviation protected</small>
              </div>
              <div className="risk-metric-box">
                <span>BETA VS S&P 500</span>
                <strong>{premiumData?.risk?.beta}</strong>
                <small>Moderate aggressive sensitivity</small>
              </div>
              <div className="risk-metric-box">
                <span>95% VALUE AT RISK (1D)</span>
                <strong className="negative">
                  {premiumData?.risk?.valueAtRisk95}
                </strong>
                <small className="negative">Estimated max 1-day normal loss</small>
              </div>
              <div className="risk-metric-box">
                <span>MAX HISTORICAL DRAWDOWN</span>
                <strong>{premiumData?.risk?.maxDrawdown}</strong>
                <small>Recovered in 42 trading days</small>
              </div>
            </div>

            {/* Stress Test Scenarios Grid */}
            <div className="stress-scenarios-section">
              <h4>Historical Stress Scenario Simulations</h4>
              <div className="stress-scenarios-grid">
                {premiumData?.risk?.stressScenarios?.map((s, idx) => (
                  <div key={idx} className="stress-card">
                    <div className="stress-card-header">
                      <b>{s.scenario}</b>
                      <span className={`stress-badge ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="stress-impact-row">
                      <span className="negative">{s.impact}</span>
                      <strong className="negative">{s.estLoss}</strong>
                    </div>
                    <small>Simulated portfolio equity impact</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PremiumGate>
      </section>

      {/* Pro Feature 2: Automated AI Rebalancing & Exportable Reports */}
      <div className="portfolio-pro-tools-grid">
        {/* Rebalancing Insights */}
        <section className="panel rebalancing-panel">
          <div className="panel-heading">
            <div className="section-title">
              <Zap size={16} className="red-text" />
              <h2>AI Portfolio Rebalancer</h2>
            </div>
            <span className="subtle-tag">PRO REBALANCER</span>
          </div>

          <PremiumGate
            featureName="AI Portfolio Rebalancer & Factor Optimizer"
            description="Algorithmic suggestions to reallocate capital, reduce tech factor concentration, and capture risk-free yield."
            benefits={[
              "Dynamic drift detection from target allocation models",
              "Tax-loss harvesting and capital gain mitigation paths",
              "One-click simulated execution rebalancing checklist",
            ]}
            source="portfolio_rebalancing"
            variant="compact"
          >
            <div className="rebalance-insights-list">
              {premiumData?.risk?.rebalanceInsights?.map((insight, i) => (
                <div key={i} className="rebalance-insight-card">
                  <div className="insight-header">
                    <AlertTriangle size={15} className="red-text" />
                    <b>{insight.title}</b>
                  </div>
                  <p>{insight.description}</p>
                  <div className="insight-action">
                    <span>Action:</span> <b>{insight.action}</b>
                  </div>
                </div>
              ))}
            </div>
          </PremiumGate>
        </section>

        {/* Audit Report Generator */}
        <section className="panel reports-export-panel">
          <div className="panel-heading">
            <div className="section-title">
              <FileText size={16} className="red-text" />
              <h2>Downloadable Audit-Grade Reports</h2>
            </div>
            <span className="subtle-tag">TAX & RISK</span>
          </div>

          <PremiumGate
            featureName="Downloadable Audit-Grade Performance Reports"
            description="Generate illustrative portfolio risk reports, realized gain/loss summaries, and Sharpe ratio breakdowns for wealth managers."
            benefits={[
              "Downloadable demo portfolio risk summary",
              "Server-verified Pro report access",
              "Automated monthly performance recap email generation",
            ]}
            source="portfolio_reports"
            variant="compact"
          >
            <div className="reports-card-content">
              <p>
                Generate institutionally formatted PDF performance audits, realized
                gain/loss summaries, and Sharpe ratio breakdowns for wealth managers.
              </p>

              <div className="report-buttons-row">
                <button
                  type="button"
                  className="button-secondary report-download-btn"
                  onClick={() => handleReportExport("PDF Portfolio Audit")}
                >
                  <FileText size={15} />
                  <span>Download Demo Risk Summary</span>
                  {!isPro && <Sparkles size={11} className="red-text" />}
                </button>
              </div>

              <small className="report-disclaimer">
                {isPro
                  ? "Pro subscription active. Audit reports available on demand."
                  : "Risk reports require an active Redline Pro subscription."}
              </small>
            </div>
          </PremiumGate>
        </section>
      </div>
    </div>
  );
}

