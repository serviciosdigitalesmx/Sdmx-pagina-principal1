import React from "react";

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  subtle?: boolean;
}

export function SurfaceCard({ elevated = false, subtle = false, className = "", children, ...props }: SurfaceCardProps) {
  const classes = [
    "overflow-hidden rounded-2xl bg-white",
    subtle ? "border border-slate-100" : "border border-slate-200",
    elevated ? "shadow-md" : "shadow-sm",
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
    <div className={`border-b border-slate-100 px-5 py-4 bg-slate-50/50 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SurfaceTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-[1.05rem] font-semibold tracking-tight text-slate-900 ${className}`} {...props}>
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
