import React from "react";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "default";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  error: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  info: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  default: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.2em] ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
