"use client";

import { useState } from "react";
import { makeSeries, signed, stocks } from "@/lib/market-data";

export default function StockComparisonChart({
  baseStock = stocks[0],
  compareStocks = [stocks[1], stocks[2]],
  timeframe = "1M",
}) {
  const [activeIdx, setActiveIdx] = useState(null);

  // Generate deterministic series for all compared stocks
  const allStocks = [baseStock, ...compareStocks];
  const seriesData = allStocks.map((st) => ({
    stock: st,
    data: makeSeries(st, timeframe),
  }));

  const length = seriesData[0]?.data?.length || 48;
  const width = 840;
  const height = 240;
  const left = 35;
  const right = 45;
  const top = 20;
  const bottom = 30;

  // Normalize each stock series to % return from index 0
  const normalizedSeries = seriesData.map(({ stock, data }) => {
    const baseClose = data[0].close;
    return {
      stock,
      points: data.map((d, i) => ({
        label: d.label,
        pct: Number((((d.close - baseClose) / baseClose) * 100).toFixed(2)),
      })),
    };
  });

  // Find min and max percentage across all stocks
  let minPct = -5;
  let maxPct = 5;
  normalizedSeries.forEach(({ points }) => {
    points.forEach((p) => {
      if (p.pct < minPct) minPct = p.pct;
      if (p.pct > maxPct) maxPct = p.pct;
    });
  });

  // Pad slightly
  minPct = Math.floor(minPct * 1.15);
  maxPct = Math.ceil(maxPct * 1.15);

  const x = (i) => left + (i / (length - 1)) * (width - left - right);
  const y = (v) => top + ((maxPct - v) / (maxPct - minPct)) * (height - top - bottom);
  const zeroY = y(0);

  const activePointIdx = activeIdx === null ? length - 1 : activeIdx;

  return (
    <div className="stock-comparison-chart">
      <div className="comparison-chart-header">
        <div className="comparison-badges">
          {normalizedSeries.map(({ stock, points }) => {
            const currentPct = points[activePointIdx]?.pct || 0;
            return (
              <div key={stock.symbol} className="comparison-legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: stock.color }}
                />
                <span className="legend-symbol">{stock.symbol}</span>
                <span
                  className={`legend-pct ${currentPct >= 0 ? "positive" : "negative"}`}
                >
                  {signed(currentPct)}
                </span>
              </div>
            );
          })}
        </div>
        <span className="comparison-label">
          {normalizedSeries[0]?.points[activePointIdx]?.label || "Latest"} · Normalized % Change
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Stock comparative performance chart"
        onMouseLeave={() => setActiveIdx(null)}
      >
        {/* Baseline 0% line */}
        <line
          x1={left}
          x2={width - right}
          y1={zeroY}
          y2={zeroY}
          stroke="#3d3e47"
          strokeDasharray="4 4"
        />
        <text
          x={width - right + 8}
          y={zeroY + 3}
          fill="#787985"
          fontSize="9"
          fontFamily="monospace"
        >
          0.0%
        </text>

        {/* Max / Min grid lines */}
        <line
          x1={left}
          x2={width - right}
          y1={top}
          y2={top}
          stroke="#202126"
          strokeDasharray="3 4"
        />
        <text
          x={width - right + 8}
          y={top + 3}
          fill="#787985"
          fontSize="9"
          fontFamily="monospace"
        >
          +{maxPct.toFixed(0)}%
        </text>

        <line
          x1={left}
          x2={width - right}
          y1={height - bottom}
          y2={height - bottom}
          stroke="#202126"
          strokeDasharray="3 4"
        />
        <text
          x={width - right + 8}
          y={height - bottom + 3}
          fill="#787985"
          fontSize="9"
          fontFamily="monospace"
        >
          {minPct.toFixed(0)}%
        </text>

        {/* Lines for each stock */}
        {normalizedSeries.map(({ stock, points }) => {
          const pathD = points
            .map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.pct)}`)
            .join(" ");
          return (
            <g key={stock.symbol}>
              <path
                d={pathD}
                fill="none"
                stroke={stock.color}
                strokeWidth="2"
                strokeLinejoin="round"
                opacity="0.9"
              />
              {activeIdx !== null && (
                <circle
                  cx={x(activePointIdx)}
                  cy={y(points[activePointIdx].pct)}
                  r="4"
                  fill={stock.color}
                  stroke="#101114"
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}

        {/* Active crosshair */}
        {activeIdx !== null && (
          <line
            x1={x(activePointIdx)}
            x2={x(activePointIdx)}
            y1={top}
            y2={height - bottom}
            stroke="#8c8d99"
            strokeDasharray="2 3"
          />
        )}

        {/* Invisible hit targets */}
        {Array.from({ length }, (_, i) => (
          <rect
            key={i}
            x={x(i) - (width - left - right) / length / 2}
            y={top}
            width={(width - left - right) / length}
            height={height - top - bottom}
            fill="transparent"
            onMouseEnter={() => setActiveIdx(i)}
          />
        ))}

        {/* X axis labels */}
        {[0, Math.floor(length / 4), Math.floor(length / 2), Math.floor((length * 3) / 4), length - 1].map(
          (idx) => (
            <text
              key={idx}
              x={x(idx)}
              y={height - 10}
              textAnchor="middle"
              fill="#747582"
              fontSize="9"
              fontFamily="monospace"
            >
              {normalizedSeries[0]?.points[idx]?.label}
            </text>
          )
        )}
      </svg>
    </div>
  );
}

