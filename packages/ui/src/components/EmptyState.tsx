import React from "react";
import { SurfaceCard } from "./Card";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className = "" }: EmptyStateProps) {
  return (
    <SurfaceCard subtle className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
      {icon ? (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300">
          {icon}
        </div>
      ) : null}
      <h3 className="text-[1.05rem] font-semibold tracking-tight text-slate-50">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </SurfaceCard>
  );
}
