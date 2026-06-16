import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "bordered";
}

export function Card({ variant = "bordered", className = "", children, ...props }: CardProps) {
  const baseStyle = "overflow-hidden rounded-2xl bg-slate-950/80";
  const variantStyle =
    variant === "elevated"
      ? "border border-slate-800/80 shadow-[0_18px_50px_rgba(2,6,23,0.35)]"
      : "border border-slate-800/70";

  return (
    <div className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-slate-800/70 px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold tracking-tight text-slate-50 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
