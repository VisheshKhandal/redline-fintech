"use client";

import { useState } from "react";
import { useChartWidth } from "@/hooks/use-chart-width";
import { money } from "@/lib/market-data";
export function Sparkline({
  seed = 1,
  negative = false
}) {
  const points = Array.from({ length: 25 }, (_, i) => {
    const y = 24 - Math.sin(i * 0.8 + seed) * 5 - (negative ? -1 : 1) * (i - 12) * 0.65;
    // Trig results can differ in their last bits between Node and browsers.
    // Serialize only visible precision so hydration sees identical attributes.
    return `${i * 4},${y.toFixed(3)}`;
  }).join(" ");
  return <svg className="sparkline" viewBox="0 0 96 44" aria-hidden="true"><polyline points={points} fill="none" stroke={negative ? "#e86476" : "#58c5a1"} strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}
export default function MarketChart({
  data,
  type,
  volume,
  symbol
}) {
  const [active, setActive] = useState(null);
  const [chartRef, width] = useChartWidth();
  const candleWidth = Math.max(2, (width - 80) / data.length * 0.65);
  const height = width < 500 ? 220 : 260,
    left = 8,
    right = 72,
    top = 20,
    bottom = 37;
  const min = Math.min(...data.map(d => d.low)) * 0.999;
  const max = Math.max(...data.map(d => d.high)) * 1.001;
  const x = i => left + i / (data.length - 1) * (width - left - right);
  const y = v => top + (max - v) / (max - min) * (height - top - bottom);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.close)}`).join(" ");
  const selected = active === null ? data.length - 1 : active;
  const point = data[selected];
  return <div ref={chartRef} className="market-chart">
    <div className="chart-readout" aria-live="polite"><span>{point.label}</span><span>O <b>{money(point.open)}</b></span><span>H <b>{money(point.high)}</b></span><span>L <b>{money(point.low)}</b></span><span>C <b className={point.close >= point.open ? "positive" : "negative"}>{money(point.close)}</b></span></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${symbol} demo ${type} price chart. Use the slider below to inspect each price.`} onPointerLeave={() => setActive(null)}>
      <defs><linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e11d35" stopOpacity="0.28" /><stop offset="100%" stopColor="#e11d35" stopOpacity="0" /></linearGradient></defs>
      {Array.from({
        length: 5
      }, (_, i) => {
        const value = min + (max - min) * i / 4;
        return <g key={i}><line x1="0" x2={width - right + 10} y1={y(value)} y2={y(value)} stroke="#242529" strokeDasharray="3 5" /><text x={width - right + 20} y={y(value) + 4} fill="#84858d" fontSize="10">{value.toFixed(2)}</text></g>;
      })}
      {volume && data.map((d, i) => <rect key={i} x={x(i) - 4} y={height - bottom - d.volume * 0.45} width="8" height={d.volume * 0.45} fill={d.close >= d.open ? "#58c5a1" : "#e86476"} opacity="0.15" />)}
      {type === "area" ? <g><path d={`${line} L${x(data.length - 1)},${height - bottom} L${left},${height - bottom} Z`} fill="url(#price-fill)" /><path className="price-line" d={line} fill="none" stroke="#f04a60" strokeWidth="2.2" strokeLinejoin="round" /></g> : data.map((d, i) => <g key={i} stroke={d.close >= d.open ? "#58c5a1" : "#e86476"}><line x1={x(i)} x2={x(i)} y1={y(d.high)} y2={y(d.low)} /><rect x={x(i) - candleWidth / 2} y={Math.min(y(d.open), y(d.close))} width={candleWidth} height={Math.max(1.5, Math.abs(y(d.open) - y(d.close)))} fill={d.close >= d.open ? "#58c5a1" : "#e86476"} rx="0.6" /></g>)}
      {(width < 500 ? [0, 23, 47] : [0, 9, 19, 28, 38, 47]).map(i => <text key={i} x={x(i)} y={height - 10} textAnchor={i === 0 ? "start" : "middle"} fill="#84858d" fontSize="10">{data[i].label}</text>)}
      {active !== null && <g><line x1={x(active)} x2={x(active)} y1={top} y2={height - bottom} stroke="#8f9098" strokeDasharray="3 4" /><circle cx={x(active)} cy={y(point.close)} r="4" fill="#f04a60" stroke="#fff" strokeWidth="1.5" /></g>}
      {data.map((d, i) => <rect key={i} x={x(i) - 8} y={top} width="17" height={height - top - bottom} fill="transparent" onPointerEnter={() => setActive(i)} onPointerDown={() => setActive(i)} />)}
    </svg>
    <label className="chart-scrubber"><span>Inspect price</span><input aria-label="Inspect chart price point" type="range" min="0" max={data.length - 1} value={selected} onChange={e => setActive(Number(e.target.value))} /><span>{point.label}</span></label>
  </div>;
}
