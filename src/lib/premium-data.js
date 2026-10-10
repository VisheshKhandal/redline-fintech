import "server-only";

// Illustrative Pro analytics. Delivered only after requirePro().
export const riskMetrics = {
    sharpeRatio: 1.84,
    sortinoRatio: 2.15,
    beta: 1.12,
    alpha: 3.42,
    valueAtRisk95: "$2,140.00",
    maxDrawdown: "-8.20%",
    volatilityAnnualized: "15.8%",
    diversificationScore: 82,
    stressScenarios: [
      {
        scenario: "2008 Subprime Shock",
        impact: "-24.2%",
        estLoss: "-$30,149",
        status: "Severe",
      },
      {
        scenario: "2022 Tech Inflation Reset",
        impact: "-18.6%",
        estLoss: "-$23,172",
        status: "Moderate",
      },
      {
        scenario: "Fed +100bps Surprise Hike",
        impact: "-6.4%",
        estLoss: "-$7,973",
        status: "Mild",
      },
      {
        scenario: "Semiconductor Export Ban",
        impact: "-11.8%",
        estLoss: "-$14,700",
        status: "Moderate",
      },
    ],
    rebalanceInsights: [
      {
        title: "Technology Overweight Alert",
        severity: "warning",
        description:
          "Portfolio holds 59.1% Technology exposure vs recommended 40-45% benchmark. A pullback in Mega-Cap semiconductors would disproportionately impact equity curve.",
        action: "Trim $5,200 across NVDA / AAPL into short-duration Treasury or BND.",
      },
      {
        title: "Cash Drag Optimization",
        severity: "info",
        description:
          "5% Cash balance ($6,229) is currently yielding 4.8% demo risk-free rate, providing adequate dry powder for market dips.",
        action: "Maintain current liquidity reserve for high-beta dip entries.",
      },
    ],
  };
