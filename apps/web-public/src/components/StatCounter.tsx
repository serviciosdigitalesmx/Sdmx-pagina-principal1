"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const { count, ref } = useCountUp(value, 1500);

  return (
    <div ref={ref} className="flex flex-col">
      <span
        className="text-3xl font-extrabold"
        style={{
          background: "var(--tenant-gradient)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {count}
        {suffix}
      </span>
      <span className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
    </div>
  );
}
