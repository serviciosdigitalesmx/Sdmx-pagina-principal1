import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-cta hover:bg-cta-hover active:bg-cta-active text-white border-transparent",
  secondary: "bg-transparent hover:bg-white/5 active:bg-white/10 text-text-primary-dark border-border-dark",
  danger: "bg-error/10 hover:bg-error/20 active:bg-error/30 text-error border-error/30",
  ghost: "bg-transparent hover:bg-white/5 active:bg-white/10 text-text-secondary-dark border-transparent",
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
    "inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-active disabled:opacity-50 disabled:pointer-events-none";

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
