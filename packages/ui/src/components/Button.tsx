import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border-sky-400/25 bg-[linear-gradient(135deg,#60a5fa_0%,#2563eb_100%)] text-white shadow-[0_18px_40px_rgba(37,99,235,0.22)] hover:brightness-110",
  secondary: "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
  danger: "border-rose-400/25 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20",
  ghost: "border-transparent bg-transparent text-slate-300 hover:bg-white/5",
  outline: "border-white/10 bg-transparent text-slate-100 hover:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({ variant = "primary", size = "md", className = "", disabled, type, children, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full border font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
