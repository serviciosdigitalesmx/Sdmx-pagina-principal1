import React from "react";

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const styles: Record<BadgeVariant, string> = {
  neutral: "border-white/10 bg-white/5 text-slate-300",
  primary: "border-sky-400/20 bg-sky-500/10 text-sky-200",
  success: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  warning: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  danger: "border-rose-400/20 bg-rose-500/10 text-rose-200",
};

export function Badge({ variant = "neutral", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusPill({ tone = "neutral", children, className = "" }: BadgeProps & { tone?: BadgeVariant }) {
  return (
    <Badge variant={tone} className={className}>
      {children}
    </Badge>
  );
}
