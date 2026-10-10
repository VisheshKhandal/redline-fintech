"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Filter,
  Globe2,
  Lock,
  Newspaper,
  Search,
  Sparkles,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";
import {
  marketSentiment,
  news,
  stocks,
} from "@/lib/market-data";
import { Brand } from "@/components/redline/brand";
import { useDashboard } from "@/context/dashboard-context";
import {
  PlanBadge,
  PremiumGate,
  UpgradeButton,
} from "@/components/redline/premium-gate";

export default function MarketBriefingPage() {
  const { isPro, openPricingModal } = useDashboard();
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [activeArticle, setActiveArticle] = useState(news[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const dialogRef = useRef(null);

  const topics = [
    "All",
    "Macro",
    "Technology",
    "Strategy",
    "Fed Policy",
    "Healthcare",
    "Commodities",
  ];

  const filteredNews = news.filter((item) => {
    const matchesTopic =
      selectedTopic === "All" || item.topic === selectedTopic;
    const matchesSearch =
      `${item.title} ${item.summary} ${item.category}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  function openArticle(item) {
    setActiveArticle(item);
    dialogRef.current?.showModal();
  }

  return (
    <div className="briefing-page enter">
      {/* Header */}
      <section className="overview-heading">
        <div>
          <span className="eyebrow">
            <span className="status-dot" /> FINANCIAL RESEARCH & INSTITUTIONAL EDITORIAL
          </span>
          <h1>
            Market Briefing. <span>Context beyond charts.</span>
          </h1>
          <p>
            Macroeconomic themes, structural sector outlooks, sentiment gauges,
            and institutional equity research.
          </p>
        </div>
      </section>

      {/* Market Sentiment & Macro Pulse Strip */}
      <section className="panel sentiment-pulse-panel">
        <div className="panel-heading">
          <div className="section-title">
            <span className="red-marker" />
            <h2>Market Sentiment & Positioning Pulse</h2>
          </div>
          <span className="tiny-label">MULTI-FACTOR INDEX</span>
        </div>

        <div className="sentiment-indicators-grid">
          {/* Fear & Greed Meter */}
          <div className="sentiment-indicator-card">
            <span className="indicator-title">FEAR & GREED INDEX</span>
            <div className="meter-score-row">
              <strong className="meter-score positive">
                {marketSentiment.fearGreedScore}
              </strong>
              <div className="meter-label-wrap">
                <span className="meter-status positive">
                  {marketSentiment.fearGreedLabel}
                </span>
                <small>Previous close: {marketSentiment.previousClose}</small>
              </div>
            </div>
            <div className="meter-gradient-bar">
              <div
                className="meter-needle"
                style={{ left: `${marketSentiment.fearGreedScore}%` }}
              />
            </div>
            <div className="meter-scale-labels">
              <span>0 (Extreme Fear)</span>
              <span>50 (Neutral)</span>
              <span>100 (Greed)</span>
            </div>
          </div>

          {/* Institutional Bull / Bear Ratio */}
          <div className="sentiment-indicator-card">
            <span className="indicator-title">INSTITUTIONAL POSITIONING</span>
            <div className="bull-bear-stats">
              <div>
                <span>BULLISH</span>
                <strong className="positive">
                  {marketSentiment.bullishPercent}%
                </strong>
              </div>
              <div>
                <span>NEUTRAL</span>
                <strong className="muted">
                  {marketSentiment.neutralPercent}%
                </strong>
              </div>
              <div>
                <span>BEARISH</span>
                <strong className="negative">
                  {marketSentiment.bearishPercent}%
                </strong>
              </div>
            </div>
            <div className="sentiment-split-bar">
              <div
                className="split-bull"
                style={{ width: `${marketSentiment.bullishPercent}%` }}
              />
              <div
                className="split-neutral"
                style={{ width: `${marketSentiment.neutralPercent}%` }}
              />
              <div
                className="split-bear"
                style={{ width: `${marketSentiment.bearishPercent}%` }}
              />
            </div>
            <small className="muted">
              Based on AAII Sentiment and active options call volume skew
            </small>
          </div>

          {/* Options Put/Call & Breadth */}
          <div className="sentiment-indicator-card">
            <span className="indicator-title">INTERNAL MARKET BREADTH</span>
            <div className="breadth-stats-row">
              <div>
                <span>Put / Call Ratio</span>
                <strong className="positive">
                  {marketSentiment.putCallRatio}
                </strong>
                <small className="positive">Call volume dominant</small>
              </div>
              <div>
                <span>Advancers / Decliners</span>
                <strong>
                  {marketSentiment.marketBreadthAdvancers} /{" "}
                  {marketSentiment.marketBreadthDecliners}
                </strong>
                <small className="positive">+2.16 Advance ratio</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Filter Pills & Search */}
      <div className="briefing-filters-bar">
        <div className="topic-tabs" role="tablist">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={selectedTopic === t}
              className={`topic-tab ${selectedTopic === t ? "active" : ""}`}
              onClick={() => setSelectedTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="briefing-search">
          <Search size={14} />
          <input
            placeholder="Search briefings & analyses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Research Feed */}
      <section className="briefing-articles-section">
        <div className="articles-grid">
          {filteredNews.map((article, index) => (
            <article
              key={article.id || index}
              className={`briefing-card ${
                index === 0 ? "featured-article-card" : ""
              }`}
              onClick={() => openArticle(article)}
            >
              <div className="briefing-card-meta">
                <span className="category-pill">{article.category}</span>
                <span className="read-time-pill">
                  <Clock size={11} /> {article.readTime}
                </span>
                {article.badge && (
                  <span className="badge-pill">
                    <Sparkles size={10} /> {article.badge}
                  </span>
                )}
              </div>

              <h2 className="article-title">{article.title}</h2>
              <p className="article-summary">{article.summary}</p>

              {article.keyTakeaways && (
                <div className="article-quick-takeaways">
                  <span className="takeaways-label">CORE TAKEAWAY:</span>
                  <p>{article.keyTakeaways[0]}</p>
                </div>
              )}

              <div className="briefing-card-footer">
                <div className="author-info">
                  <User size={13} className="muted" />
                  <span>{article.author}</span>
                </div>
                <span className="read-more-link">
                  Read Analysis <ArrowUpRight size={13} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pro Feature: Institutional Deep-Dive Research & DCF Models */}
      <section className="panel pro-research-panel">
        <div className="panel-heading">
          <div className="section-title">
            <BookOpen size={16} className="red-text" />
            <h2>Institutional Research Deep Dives & Valuation Models</h2>
          </div>
          <span className="subtle-tag">PRO SUITE</span>
        </div>

        <PremiumGate
          featureName="Institutional Research Deep Dives & DCF Valuation Models"
          description="Access unedited 40+ page Wall Street tier research reports, discounted cash flow (DCF) models, and proprietary gross margin supply chain projections."
          benefits={[
            "NVIDIA Blackwell Q4 margin audit & CoWoS packaging allocation model",
            "Fed balance sheet QT runoff timeline & liquidity stress scenario model",
            "Downloadable Excel financial models with sensitivity tables",
          ]}
          source="institutional_research"
        >
          <div className="pro-research-demo-content">
            <div className="report-preview-box">
              <div className="report-preview-header">
                <FileText size={20} className="red-text" />
                <div>
                  <h4>
                    Blackwell Architecture: Hyperscaler Unit Economics & Margin Audit
                  </h4>
                  <small>
                    48-Page Institutional Report · Marcus Vance, CFA · Published Oct 2026
                  </small>
                </div>
                <span className="status-badge pro">CONVICTION OVERWEIGHT</span>
              </div>

              <div className="report-key-metrics-grid">
                <div>
                  <span>Consensus Target</span>
                  <strong>$175.00</strong>
                  <small className="positive">+22.5% Upside</small>
                </div>
                <div>
                  <span>DCF Fair Value (WACC 8.8%)</span>
                  <strong>$184.20</strong>
                  <small className="positive">+28.9% Implied</small>
                </div>
                <div>
                  <span>FY27 Est Gross Margin</span>
                  <strong>75.4%</strong>
                  <small>180bps above consensus</small>
                </div>
              </div>
            </div>
          </div>
        </PremiumGate>
      </section>

      {/* Full Article Reader Dialog */}
      <dialog
        ref={dialogRef}
        className="news-dialog reader-dialog"
        aria-labelledby="reader-dialog-title"
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

        <div className="reader-dialog-body">
          <div className="reader-meta-row">
            <span className="eyebrow red-text">{activeArticle.category}</span>
            <span className="muted">·</span>
            <span className="muted">{activeArticle.readTime}</span>
            <span className="muted">·</span>
            <span className="muted">{activeArticle.author}</span>
          </div>

          <h2 id="reader-dialog-title">{activeArticle.title}</h2>

          {activeArticle.rating && (
            <div className="reader-rating-box">
              <span>ANALYST VIEW:</span>
              <b>{activeArticle.rating}</b>
            </div>
          )}

          <div className="reader-text">
            {activeArticle.body?.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {activeArticle.keyTakeaways && (
            <div className="reader-takeaways-block">
              <h3>Key Structural Takeaways</h3>
              <ul>
                {activeArticle.keyTakeaways.map((takeaway, i) => (
                  <li key={i}>
                    <CheckCircle2 size={14} className="positive" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <span>Redline Research Intelligence · Demo Editorial Feed</span>
          <button
            type="button"
            className="button-secondary"
            onClick={() => dialogRef.current?.close()}
          >
            Return to Briefings <ArrowRight size={15} />
          </button>
        </div>
      </dialog>
    </div>
  );
}

