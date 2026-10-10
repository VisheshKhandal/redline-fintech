"use client";
import { useEffect, useRef, useState } from "react";

// Keep SVG text in readable CSS-pixel units rather than shrinking an 860px canvas.
export function useChartWidth(initialWidth = 860) {
  const ref = useRef(null);
  const [width, setWidth] = useState(initialWidth);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(Math.max(180, Math.min(initialWidth, Math.round(entry.contentRect.width))));
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [initialWidth]);
  return [ref, width];
}
