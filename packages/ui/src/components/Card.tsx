import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "bordered";
}

export function Card({ variant = "bordered", className = "", children, ...props }: CardProps) {
  const baseStyle = "rounded-xl overflow-hidden bg-bg-dark";
  const variantStyle =
    variant === "elevated"
      ? "shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border-dark"
      : "border border-border-dark";

  return (
    <div className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-4 border-b border-border-dark ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-text-primary-dark tracking-tight ${className}`} {...props}>
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
