// Deterministic, illustrative data. No live quotes or financial API calls.
export const stocks = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: 142.87,
    change: 2.84,
    color: "#9cc66a",
    sector: "Technology",
    volume: "218.4M",
    marketCap: "$3.51T",
    peRatio: 64.2,
    high52: 153.12,
    low52: 45.21,
    avgVolume: "192.5M",
    beta: 1.68,
    rsi: 68.4,
    signal: "Strong Buy",
    dividendYield: "0.03%",
    analystTarget: 175.0,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 228.26,
    change: 1.24,
    color: "#b9beca",
    sector: "Technology",
    volume: "48.2M",
    marketCap: "$3.46T",
    peRatio: 34.8,
    high52: 237.23,
    low52: 164.08,
    avgVolume: "52.4M",
    beta: 1.05,
    rsi: 58.2,
    signal: "Buy",
    dividendYield: "0.44%",
    analystTarget: 250.0,
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 428.76,
    change: 0.86,
    color: "#76a8e9",
    sector: "Technology",
    volume: "21.8M",
    marketCap: "$3.18T",
    peRatio: 36.1,
    high52: 468.35,
    low52: 327.25,
    avgVolume: "24.1M",
    beta: 1.14,
    rsi: 54.1,
    signal: "Hold",
    dividendYield: "0.75%",
    analystTarget: 495.0,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 248.5,
    change: -1.32,
    color: "#ee6275",
    sector: "Automotive",
    volume: "86.3M",
    marketCap: "$792.8B",
    peRatio: 72.4,
    high52: 271.0,
    low52: 138.8,
    avgVolume: "94.6M",
    beta: 2.34,
    rsi: 46.8,
    signal: "Neutral",
    dividendYield: "0.00%",
    analystTarget: 260.0,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com",
    price: 198.42,
    change: 1.68,
    color: "#eeb877",
    sector: "Consumer",
    volume: "35.7M",
    marketCap: "$2.06T",
    peRatio: 44.5,
    high52: 201.2,
    low52: 118.35,
    avgVolume: "42.0M",
    beta: 1.18,
    rsi: 62.3,
    signal: "Buy",
    dividendYield: "0.00%",
    analystTarget: 224.0,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 176.84,
    change: -0.42,
    color: "#b7a2e4",
    sector: "Communication",
    volume: "27.1M",
    marketCap: "$2.19T",
    peRatio: 23.9,
    high52: 191.75,
    low52: 120.21,
    avgVolume: "31.4M",
    beta: 1.06,
    rsi: 48.7,
    signal: "Buy",
    dividendYield: "0.45%",
    analystTarget: 205.0,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 589.32,
    change: 2.15,
    color: "#7b9ae9",
    sector: "Communication",
    volume: "16.4M",
    marketCap: "$1.49T",
    peRatio: 28.6,
    high52: 602.95,
    low52: 279.4,
    avgVolume: "18.2M",
    beta: 1.25,
    rsi: 71.2,
    signal: "Strong Buy",
    dividendYield: "0.34%",
    analystTarget: 640.0,
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    price: 224.18,
    change: -0.68,
    color: "#b4a487",
    sector: "Financials",
    volume: "9.6M",
    marketCap: "$641.5B",
    peRatio: 12.4,
    high52: 231.84,
    low52: 143.52,
    avgVolume: "10.8M",
    beta: 0.88,
    rsi: 51.6,
    signal: "Hold",
    dividendYield: "2.05%",
    analystTarget: 238.0,
  },
  {
    symbol: "AMD",
    name: "Adv. Micro Devices",
    price: 156.4,
    change: 3.12,
    color: "#ec5d70",
    sector: "Technology",
    volume: "64.8M",
    marketCap: "$252.8B",
    peRatio: 114.2,
    high52: 227.3,
    low52: 94.04,
    avgVolume: "71.3M",
    beta: 1.72,
    rsi: 61.5,
    signal: "Buy",
    dividendYield: "0.00%",
    analystTarget: 185.0,
  },
  {
    symbol: "AVGO",
    name: "Broadcom Inc.",
    price: 182.15,
    change: 1.94,
    color: "#4fb7a2",
    sector: "Technology",
    volume: "24.5M",
    marketCap: "$850.4B",
    peRatio: 48.7,
    high52: 185.16,
    low52: 86.82,
    avgVolume: "28.0M",
    beta: 1.36,
    rsi: 65.8,
    signal: "Strong Buy",
    dividendYield: "1.16%",
    analystTarget: 210.0,
  },
  {
    symbol: "PLTR",
    name: "Palantir Tech",
    price: 43.82,
    change: 4.86,
    color: "#9f83f2",
    sector: "Technology",
    volume: "78.2M",
    marketCap: "$97.6B",
    peRatio: 118.5,
    high52: 44.6,
    low52: 14.48,
    avgVolume: "66.5M",
    beta: 2.1,
    rsi: 74.9,
    signal: "Overbought",
    dividendYield: "0.00%",
    analystTarget: 38.0,
  },
  {
    symbol: "LLY",
    name: "Eli Lilly & Co",
    price: 914.5,
    change: -0.92,
    color: "#e28659",
    sector: "Healthcare",
    volume: "3.2M",
    marketCap: "$868.2B",
    peRatio: 98.4,
    high52: 972.53,
    low52: 520.1,
    avgVolume: "3.8M",
    beta: 0.65,
    rsi: 48.2,
    signal: "Hold",
    dividendYield: "0.57%",
    analystTarget: 1020.0,
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 722.18,
    change: 1.45,
    color: "#e8475c",
    sector: "Communication",
    volume: "4.1M",
    marketCap: "$311.5B",
    peRatio: 41.2,
    high52: 735.0,
    low52: 344.73,
    avgVolume: "4.6M",
    beta: 1.28,
    rsi: 67.1,
    signal: "Buy",
    dividendYield: "0.00%",
    analystTarget: 760.0,
  },
  {
    symbol: "COST",
    name: "Costco Wholesale",
    price: 898.4,
    change: 0.35,
    color: "#4ca2c7",
    sector: "Consumer",
    volume: "1.8M",
    marketCap: "$398.2B",
    peRatio: 54.3,
    high52: 923.83,
    low52: 535.15,
    avgVolume: "2.1M",
    beta: 0.78,
    rsi: 52.4,
    signal: "Hold",
    dividendYield: "0.52%",
    analystTarget: 935.0,
  },
  {
    symbol: "CRM",
    name: "Salesforce Inc.",
    price: 288.75,
    change: -1.15,
    color: "#5b90f6",
    sector: "Technology",
    volume: "6.4M",
    marketCap: "$278.4B",
    peRatio: 49.1,
    high52: 318.72,
    low52: 193.68,
    avgVolume: "7.2M",
    beta: 1.19,
    rsi: 44.9,
    signal: "Neutral",
    dividendYield: "0.55%",
    analystTarget: 315.0,
  },
  {
    symbol: "BRK.B",
    name: "Berkshire Hathaway",
    price: 458.12,
    change: 0.28,
    color: "#a496b8",
    sector: "Financials",
    volume: "3.1M",
    marketCap: "$984.1B",
    peRatio: 21.3,
    high52: 474.88,
    low52: 339.22,
    avgVolume: "3.5M",
    beta: 0.74,
    rsi: 50.8,
    signal: "Hold",
    dividendYield: "0.00%",
    analystTarget: 485.0,
  },
];

export const indices = [
  {
    name: "S&P 500",
    symbol: "SPX",
    value: "5,892.16",
    change: 0.82,
    category: "Equities",
  },
  {
    name: "NASDAQ 100",
    symbol: "IXIC",
    value: "18,421.09",
    change: 1.24,
    category: "Equities",
  },
  {
    name: "DOW JONES",
    symbol: "DJI",
    value: "42,863.86",
    change: -0.16,
    category: "Equities",
  },
  {
    name: "VIX INDEX",
    symbol: "VOLATILITY",
    value: "16.42",
    change: -2.38,
    category: "Volatility",
  },
  {
    name: "RUSSELL 2000",
    symbol: "RUT",
    value: "2,246.30",
    change: 1.05,
    category: "Small Cap",
  },
  {
    name: "US 10Y YIELD",
    symbol: "US10Y",
    value: "4.08%",
    change: -0.45,
    category: "Bonds",
  },
  {
    name: "CRUDE OIL",
    symbol: "WTI",
    value: "$75.56",
    change: -1.18,
    category: "Commodities",
  },
  {
    name: "BITCOIN",
    symbol: "BTC/USD",
    value: "$63,820",
    change: 3.42,
    category: "Crypto",
  },
];

export const sectors = [
  "All",
  "Technology",
  "Communication",
  "Consumer",
  "Automotive",
  "Financials",
  "Healthcare",
];

export const timeframes = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const signed = (value) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const roundToCents = (value) => Number(value.toFixed(2));

export function makeSeries(stock, timeframe) {
  const period = Math.max(0, timeframes.indexOf(timeframe));
  const seed = Math.max(1, stocks.findIndex((item) => item.symbol === stock.symbol) + 1);
  const count = 48;
  const scale = [0.025, 0.055, 0.1, 0.16, 0.32, 0.48][period] || 0.1;
  const raw = Array.from(
    { length: count },
    (_, i) =>
      Math.sin(i * 0.55 + seed) * 0.18 +
      Math.cos(i * 1.6 + period) * 0.065 +
      (i / count) * (stock.change > 0 ? 0.9 : -0.35)
  );

  return raw.map((value, i) => {
    const close = roundToCents(
      stock.price * (1 + (value - raw[count - 1]) * scale)
    );
    const open = roundToCents(
      i
        ? stock.price * (1 + (raw[i - 1] - raw[count - 1]) * scale)
        : close * 0.998
    );
    const wick =
      stock.price * scale * (0.035 + Math.abs(Math.sin(i + seed)) * 0.04);
    let label;
    if (period === 0) {
      const minutes = 570 + Math.round((i / (count - 1)) * 390);
      label = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
        minutes % 60
      ).padStart(2, "0")}`;
    } else {
      const days = [0, 7, 30, 90, 365, 1095][period];
      const date = new Date(
        Date.UTC(2026, 9, 9) - ((count - 1 - i) / (count - 1)) * days * 86400000
      );
      label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(period > 3 ? { year: "2-digit" } : {}),
        timeZone: "UTC",
      });
    }

    // Deterministic technical indicator calculations for Pro demo
    const rsiVal = Number(
      (40 + Math.sin(i * 0.4 + seed) * 22 + (stock.change > 0 ? 12 : -8)).toFixed(1)
    );
    const ema20 = roundToCents(close * (1 + Math.sin(i * 0.3) * 0.012));
    const ema50 = roundToCents(close * (1 - Math.cos(i * 0.2) * 0.02));
    const bollingerUpper = roundToCents(close * 1.035);
    const bollingerLower = roundToCents(close * 0.965);

    return {
      label,
      open,
      close,
      high: roundToCents(Math.max(open, close) + wick),
      low: roundToCents(Math.min(open, close) - wick),
      volume: roundToCents(20 + Math.abs(Math.sin(i * 3.17 + seed)) * 65),
      rsi: Math.max(15, Math.min(88, rsiVal)),
      ema20,
      ema50,
      bollingerUpper,
      bollingerLower,
    };
  });
}

// Portfolio dataset
export const demoPortfolio = {
  totalValue: 124582.8,
  totalReturnDollars: 19556.4,
  totalReturnPercent: 18.62,
  todayReturnDollars: 1428.62,
  todayReturnPercent: 1.16,
  cashBalance: 6229.14,
  investedCapital: 105026.4,
  holdings: [
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      shares: 195,
      avgBuyPrice: 104.2,
      currentPrice: 142.87,
      marketValue: 27859.65,
      unrealizedReturn: 7540.65,
      returnPercent: 37.11,
      todayChange: 2.84,
      allocation: 22.4,
      sector: "Technology",
      assetClass: "Equities",
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 110,
      avgBuyPrice: 192.4,
      currentPrice: 228.26,
      marketValue: 25108.6,
      unrealizedReturn: 3944.6,
      returnPercent: 18.64,
      todayChange: 1.24,
      allocation: 20.2,
      sector: "Technology",
      assetClass: "Equities",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      shares: 48,
      avgBuyPrice: 382.1,
      currentPrice: 428.76,
      marketValue: 20580.48,
      unrealizedReturn: 2239.68,
      returnPercent: 12.21,
      todayChange: 0.86,
      allocation: 16.5,
      sector: "Technology",
      assetClass: "Equities",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      shares: 82,
      avgBuyPrice: 168.5,
      currentPrice: 198.42,
      marketValue: 16270.44,
      unrealizedReturn: 2453.44,
      returnPercent: 17.76,
      todayChange: 1.68,
      allocation: 13.1,
      sector: "Consumer",
      assetClass: "Equities",
    },
    {
      symbol: "VTI",
      name: "Vanguard Total Stock ETF",
      shares: 75,
      avgBuyPrice: 244.0,
      currentPrice: 282.15,
      marketValue: 21161.25,
      unrealizedReturn: 2861.25,
      returnPercent: 15.64,
      todayChange: 0.74,
      allocation: 17.0,
      sector: "Broad Market",
      assetClass: "ETFs",
    },
    {
      symbol: "BND",
      name: "Vanguard Total Bond ETF",
      shares: 102,
      avgBuyPrice: 72.8,
      currentPrice: 72.28,
      marketValue: 7372.56,
      unrealizedReturn: -53.04,
      returnPercent: -0.71,
      todayChange: -0.15,
      allocation: 5.8,
      sector: "Fixed Income",
      assetClass: "Bonds",
    },
  ],
  allocations: [
    { label: "Equities", percent: 62, color: "#e11d35", value: "$77,241" },
    { label: "ETFs", percent: 23, color: "#a84755", value: "$28,654" },
    { label: "Bonds", percent: 10, color: "#db9da6", value: "$12,458" },
    { label: "Cash Reserves", percent: 5, color: "#5d616a", value: "$6,229" },
  ],
  sectorAllocations: [
    { sector: "Technology", percent: 59.1, color: "#e11d35" },
    { sector: "Consumer", percent: 13.1, color: "#eeb877" },
    { sector: "Broad ETF", percent: 17.0, color: "#a84755" },
    { sector: "Fixed Income", percent: 5.8, color: "#db9da6" },
    { sector: "Cash", percent: 5.0, color: "#5d616a" },
  ],
  
};

export function makePortfolioSeries(timeframe = "1Y") {
  const points = 36;
  const daysMap = { "1M": 30, "3M": 90, "6M": 180, "1Y": 365, YTD: 280, ALL: 730 };
  const totalDays = daysMap[timeframe] || 365;
  const startVal = 105000;
  const targetVal = 124582.8;

  return Array.from({ length: points }, (_, i) => {
    const progress = i / (points - 1);
    const date = new Date(
      Date.UTC(2026, 9, 9) - (1 - progress) * totalDays * 86400000
    );
    const noise = Math.sin(i * 0.7) * 1800 + Math.cos(i * 1.4) * 900;
    const value = roundToCents(
      startVal + (targetVal - startVal) * Math.pow(progress, 0.85) + (i === points - 1 ? 0 : noise)
    );
    const benchmark = roundToCents(
      startVal + (targetVal - startVal) * progress * 0.68 + noise * 0.5
    );

    return {
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: timeframe === "ALL" ? "2-digit" : undefined,
      }),
      value: i === points - 1 ? targetVal : value,
      benchmark,
    };
  });
}

// Watchlist default signals and sample alerts
export const sampleWatchlistAlerts = [
  {
    symbol: "NVDA",
    condition: "Crosses Above $150.00",
    status: "Active",
    created: "Oct 06, 2026",
    triggered: false,
  },
  {
    symbol: "TSLA",
    condition: "Drops Below $240.00",
    status: "Active",
    created: "Oct 08, 2026",
    triggered: false,
  },
  {
    symbol: "AAPL",
    condition: "RSI Exceeds 70 (Overbought)",
    status: "Triggered",
    created: "Sep 28, 2026",
    triggered: true,
  },
];

// Market Briefing & Institutional Research
export const news = [
  {
    id: "tech-momentum-2026",
    category: "MARKET OUTLOOK",
    topic: "Macro",
    badge: "Featured Analysis",
    title: "Tech takes the lead as investor sentiment finds its footing",
    readTime: "12 min read",
    author: "Elena Rostova, Chief Equity Strategist",
    date: "Oct 09, 2026",
    summary:
      "Technology shares lead a broad advance as institutional order flow rotates aggressively into semiconductor architectures and hyperscale cloud providers.",
    rating: "Bullish (S&P 5,950 Target)",
    keyTakeaways: [
      "Hyperscale CAPEX commitments accelerated +18% quarter-over-quarter.",
      "Defensive sectors trade at a 15% valuation discount relative to historical norms.",
      "VIX compression below 17 suggests systematic vol-targeting funds are re-leveraging.",
    ],
    body: "In this fictional market scenario, technology shares lead a broad advance as investors rotate toward large-cap growth companies. Semiconductor names show the strongest relative momentum, while defensive sectors trade in a tighter range. Capital expenditure guidance among the top cloud hyperscalers reveals that AI infrastructure spending has entered a sustained multi-year deployment wave.\n\nInstitutional desks note steady inflows into broad tech ETFs alongside selective options call skew. While overall index breadth has broadened compared to earlier quarters, semiconductor leadership remains the primary engine driving valuation expansion. This editorial sample demonstrates the terminal’s research reading experience; all data and scenarios are illustrative.",
  },
  {
    id: "semi-blackwell-dissection",
    category: "SECTOR DEEP DIVE",
    topic: "Technology",
    badge: "Pro Institutional",
    title: "The semiconductor story: looking beyond headline revenue",
    readTime: "16 min read",
    author: "Marcus Vance, CFA, Hardware Intelligence",
    date: "Oct 08, 2026",
    summary:
      "A granular breakdown of packaging bottlenecks, CoWoS supply allocations, and gross margin trajectories across top fabless designers.",
    rating: "Overweight (Conviction List)",
    keyTakeaways: [
      "Advanced packaging supply constraints expected to ease by late Q4.",
      "Gross margins projected to stabilize near 75.2% despite higher foundry wafers.",
      "Hyperscalers showing zero price elasticity for mission-critical training clusters.",
    ],
    body: "This research brief explores the structural metrics that govern semiconductor valuations: wafer yields, high-bandwidth memory (HBM) supply commitments, and enterprise customer concentration. Evaluating suppliers across a full capital equipment cycle reveals that structural demand continues to outpace merchant fab capacity.\n\nInvestors must distinguish between cyclical consumer electronics silicon and structural high-performance compute silicon. Valuation multiples remain historically elevated, but operating leverage and free cash flow conversion rates support premium pricing power.",
  },
  {
    id: "portfolio-diversification-note",
    category: "PORTFOLIO NOTES",
    topic: "Strategy",
    badge: "Quantitative Guide",
    title: "Why correlation management beats simple asset diversification",
    readTime: "7 min read",
    author: "Sarah Chen, Head of Quantitative Research",
    date: "Oct 07, 2026",
    summary:
      "Holding ten different tech stocks is not diversification. How sector factor loadings create hidden concentration risks in retail portfolios.",
    rating: "Portfolio Optimization",
    keyTakeaways: [
      "Correlation between Mega-Cap tech and consumer discretionary reached 0.82.",
      "Adding uncorrelated assets reduces portfolio volatility without lowering returns.",
      "Dynamic rebalancing shields against multi-sigma drawdowns.",
    ],
    body: "This portfolio note examines how traditional asset allocation models can give a false sense of security during market stress. Portfolios that appear diversified across multiple brand names frequently carry identical factor exposures: high beta, momentum sensitivity, and sensitivity to long-duration real yields.\n\nBy incorporating non-correlated assets such as short-duration fixed income, commodities, and low-beta value positions, investors can dampen max drawdown metrics by up to 34% while maintaining capital appreciation targets.",
  },
  {
    id: "fed-liquidity-outlook",
    category: "MACRO MONITOR",
    topic: "Fed Policy",
    badge: "Macro Pulse",
    title: "Central bank balance sheets and the autumn liquidity window",
    readTime: "10 min read",
    author: "David Sterling, Senior Macro Economist",
    date: "Oct 06, 2026",
    summary:
      "Analyzing Treasury General Account (TGA) replenishment, reverse repo runoff, and their net implications for equity valuations.",
    rating: "Neutral / Rangebound",
    keyTakeaways: [
      "Reverse repo facility balances nearing stabilization floor.",
      "Net bank reserves remain comfortably above regulatory stress thresholds.",
      "Yield curve re-steepening signals early stages of credit expansion.",
    ],
    body: "Global central banks continue navigating a delicate soft-landing path. While rate cuts have commenced across key developed markets, quantitative tightening runoff mechanics require vigilant monitoring. Historically, equity multiples expand rapidly when net liquidity expands, but contract when Treasury issuance absorbs liquidity.",
  },
  {
    id: "biotech-breakthroughs-2026",
    category: "HEALTHCARE RADAR",
    topic: "Healthcare",
    badge: "Pipeline Review",
    title: "Metabolic and oncology pipelines: The next capital frontier",
    readTime: "9 min read",
    author: "Dr. Aris Thorne, Life Sciences Lead",
    date: "Oct 05, 2026",
    summary:
      "GLP-1 oral formulations and targeted antibody-drug conjugates (ADCs) are redefining pharmaceutical enterprise valuations.",
    rating: "Overweight Selective",
    keyTakeaways: [
      "Next-generation oral peptides targeting commercial rollout in 2027.",
      "M&A activity in small-cap clinical biotechs up 26% year-to-date.",
      "Healthcare defensive qualities provide valuable beta-hedging.",
    ],
    body: "The biopharmaceutical sector is experiencing a historic wave of pipeline commercialization. As metabolic therapies expand into cardiovascular, sleep, and liver indications, addressable market projections continue to revise upward. Concurrently, oncology targeted therapeutics are commanding premium acquisition multiples from diversified pharmaceutical giants.",
  },
  {
    id: "energy-transition-reality",
    category: "COMMODITIES & ENERGY",
    topic: "Commodities",
    badge: "Structural Outlook",
    title: "Base-load power demand meets the AI data center surge",
    readTime: "11 min read",
    author: "Rebecca Morales, Commodities Director",
    date: "Oct 04, 2026",
    summary:
      "How nuclear power purchase agreements and natural gas peaking plants are becoming essential tech infrastructure enablers.",
    rating: "Structural Bullish",
    keyTakeaways: [
      "Nuclear generation agreements signed by major hyperscalers at premium tariffs.",
      "Natural gas peaking generation demand up 14% across high-density data corridors.",
      "Grid transmission backlog remains the single largest operational bottleneck.",
    ],
    body: "Artificial intelligence compute demands an unprecedented volume of uninterrupted clean baseload power. As hyperscale data centers scale from megawatts to gigawatts, utility and independent power producers are negotiating long-term power purchase contracts. This dynamic creates secular tailwinds for clean energy and nuclear operators.",
  },
];

// Market sentiment indicators
export const marketSentiment = {
  fearGreedScore: 68,
  fearGreedLabel: "Greed",
  previousClose: 64,
  oneWeekAgo: 59,
  bullishPercent: 64.2,
  bearishPercent: 21.8,
  neutralPercent: 14.0,
  putCallRatio: 0.81,
  marketBreadthAdvancers: 342,
  marketBreadthDecliners: 158,
};

// Plan and entitlement configuration
export const PLANS = {
  FREE: {
    id: "free",
    name: "Redline Free",
    tagline: "Essential market perspective for individual traders",
    priceMonthly: 0,
    priceAnnual: 0,
    watchlistLimit: 5,
    features: [
      { text: "Core stock indices & market overview", included: true },
      { text: "Interactive Area & Candlestick charts", included: true },
      { text: "Up to 5 watchlist assets with real-time tracking", included: true },
      { text: "Essential portfolio equity tracking & holdings", included: true },
      { text: "Curated market briefing & editorial feed", included: true },
      { text: "Advanced technical indicators (RSI, EMA, Bollinger)", included: false },
      { text: "Multi-asset stock performance comparison", included: false },
      { text: "Institutional portfolio risk metrics (Sharpe, VaR)", included: false },
      { text: "Automated custom price & volatility alerts", included: false },
      { text: "Institutional equity deep-dive research reports", included: false },
      { text: "Downloadable audit-grade PDF & CSV reporting", included: false },
    ],
  },
  PRO: {
    id: "pro",
    name: "Redline Pro Terminal",
    tagline: "Institutional-grade financial intelligence & risk analytics",
    priceMonthly: 29,
    priceAnnual: 290, // $24.17/mo, ~17% savings
    watchlistLimit: 9999,
    badge: "MOST POPULAR",
    features: [
      { text: "Core stock indices & market overview", included: true },
      { text: "Interactive Area & Candlestick charts", included: true },
      { text: "Unlimited custom watchlists & smart multi-lists", included: true },
      { text: "Advanced technical indicators (RSI, EMA 20/50, Bollinger Bands)", included: true },
      { text: "Multi-asset spread & relative performance comparison", included: true },
      { text: "Full institutional risk analytics (Sharpe, Sortino, VaR, Max Drawdown)", included: true },
      { text: "Portfolio stress test simulations & AI rebalance engine", included: true },
      { text: "Custom price, momentum breakout & volume surge alerts", included: true },
      { text: "Institutional deep-dive equity research & DCF models", included: true },
      { text: "Downloadable audit-grade PDF/CSV tax & risk reporting", included: true },
      { text: "Priority simulated order book & dark pool flow tracking", included: true },
    ],
  },
};
