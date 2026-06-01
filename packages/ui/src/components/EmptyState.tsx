import React from "react";
import { Card } from "./Card";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className = "" }: EmptyStateProps) {
  return (
    <Card variant="bordered" className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-inactive">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-text-primary-dark">{title}</h3>
      <p className="mb-6 max-w-sm text-sm leading-6 text-text-secondary-dark">{description}</p>
      {action && <div>{action}</div>}
    </Card>
  );
}
