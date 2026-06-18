import React from "react";

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  subtle?: boolean;
}

export function SurfaceCard({ elevated = false, subtle = false, className = "", children, ...props }: SurfaceCardProps) {
  const classes = [
    "overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]",
    subtle ? "border border-white/8" : "border border-white/10",
    elevated ? "shadow-[0_24px_80px_rgba(2,6,23,0.36)]" : "shadow-[0_16px_48px_rgba(2,6,23,0.22)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function SurfaceHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-white/10 px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SurfaceTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-[1.05rem] font-semibold tracking-tight text-slate-50 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function SurfaceContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

SurfaceCard.Header = SurfaceHeader;
SurfaceCard.Title = SurfaceTitle;
SurfaceCard.Content = SurfaceContent;
