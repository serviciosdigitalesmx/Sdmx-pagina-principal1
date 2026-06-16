import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white border-transparent shadow-[0_12px_24px_rgba(59,130,246,0.22)]",
  secondary: "bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-100 border-slate-700",
  danger: "bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-200 border-rose-500/30",
  ghost: "bg-transparent hover:bg-white/5 active:bg-white/10 text-slate-300 border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg font-semibold",
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
  const baseStyle =
    "inline-flex items-center justify-center rounded-xl border font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
