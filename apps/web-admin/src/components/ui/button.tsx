import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-sky-500 text-white shadow-[0_12px_24px_rgba(59,130,246,0.22)] hover:bg-sky-600",
  secondary: "border-slate-800 bg-slate-900 text-slate-100 hover:bg-slate-800",
  danger: "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
  ghost: "border-transparent bg-transparent text-slate-300 hover:bg-white/5",
  outline: "border-slate-800 bg-transparent text-slate-100 hover:bg-slate-800",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  type,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl border font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
