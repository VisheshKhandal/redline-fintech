"use client";

import { useState } from "react";
import { useChartWidth } from "@/hooks/use-chart-width";

export default function TechnicalIndicatorChart({
  data,
  symbol = "NVDA",
}) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [chartRef, width] = useChartWidth(840);

  if (!data || data.length === 0) return null;

  const length = data.length;

  const height = 150;
  const left = 30;
  const right = 45;
  const top = 18;
  const bottom = 22;

  const x = (i) => left + (i / (length - 1)) * (width - left - right);
  const y = (rsi) => top + ((100 - rsi) / 100) * (height - top - bottom);

  const activePointIdx = activeIdx === null ? length - 1 : activeIdx;
  const currentRsi = data[activePointIdx]?.rsi || 50;
  const currentLabel = data[activePointIdx]?.label || "";

  const rsiPath = data
    .map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.rsi)}`)
    .join(" ");

  const y70 = y(70);
  const y30 = y(30);
  const y50 = y(50);

  return (
    <div ref={chartRef} className="technical-indicator-chart">
      <div className="indicator-header">
        <div className="indicator-title-row">
          <span className="indicator-badge">RSI (14)</span>
          <span className="indicator-asset">{symbol} Relative Strength Oscillator</span>
        </div>
        <div className="indicator-readout">
          <span>{currentLabel}</span>
          <b
            className={`rsi-value ${
              currentRsi >= 70
                ? "rsi-overbought"
                : currentRsi <= 30
                ? "rsi-oversold"
                : "rsi-neutral"
            }`}
          >
            {currentRsi.toFixed(1)}
          </b>
          <span className="rsi-zone-label">
            {currentRsi >= 70
              ? "OVERBOUGHT"
              : currentRsi <= 30
              ? "OVERSOLD"
              : "NEUTRAL ZONE"}
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="RSI technical indicator chart"
        onPointerLeave={() => setActiveIdx(null)}
      >
        {/* Shaded Neutral Band between 30 and 70 */}
        <rect
          x={left}
          y={y70}
          width={width - left - right}
          height={y30 - y70}
          fill="#31222b"
          opacity="0.25"
        />

        {/* 70 Overbought Line */}
        <line
          x1={left}
          x2={width - right}
          y1={y70}
          y2={y70}
          stroke="#e86476"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <text
          x={width - right + 8}
          y={y70 + 3}
          fill="#e86476"
          fontSize="9"
          fontFamily="monospace"
        >
          70
        </text>

        {/* 50 Center Line */}
        <line
          x1={left}
          x2={width - right}
          y1={y50}
          y2={y50}
          stroke="#2d2e38"
          strokeDasharray="2 4"
          strokeWidth="1"
        />
        <text
          x={width - right + 8}
          y={y50 + 3}
          fill="#676875"
          fontSize="9"
          fontFamily="monospace"
        >
          50
        </text>

        {/* 30 Oversold Line */}
        <line
          x1={left}
          x2={width - right}
          y1={y30}
          y2={y30}
          stroke="#58c5a1"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <text
          x={width - right + 8}
          y={y30 + 3}
          fill="#58c5a1"
          fontSize="9"
          fontFamily="monospace"
        >
          30
        </text>

        {/* RSI Curve */}
        <path
          d={rsiPath}
          fill="none"
          stroke="#f04a60"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Active Point */}
        {activeIdx !== null && (
          <g>
            <line
              x1={x(activePointIdx)}
              x2={x(activePointIdx)}
              y1={top}
              y2={height - bottom}
              stroke="#8c8d99"
              strokeDasharray="2 3"
            />
            <circle
              cx={x(activePointIdx)}
              cy={y(currentRsi)}
              r="3.5"
              fill="#f04a60"
              stroke="#fff"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* Hit targets */}
        {data.map((_, i) => (
          <rect
            key={i}
            x={x(i) - (width - left - right) / length / 2}
            y={top}
            width={(width - left - right) / length}
            height={height - top - bottom}
            fill="transparent"
            onPointerEnter={() => setActiveIdx(i)} onPointerDown={() => setActiveIdx(i)}
          />
        ))}
      </svg>
    </div>
  );
}

