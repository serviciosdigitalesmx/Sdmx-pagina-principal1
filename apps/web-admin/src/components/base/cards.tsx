'use client';

import type { ReactNode } from 'react';

export function BaseCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card-base p-4 ${className}`}>{children}</section>;
}

export function MoneyCard({
  label,
  value,
  helper,
  accent = false,
}: {
  label: string;
  value: string;
  helper?: string;
  accent?: boolean;
}) {
  return (
    <div className={`card-base p-4 ${accent ? 'border-sky-500/20' : ''}`}>
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-black text-slate-50">{value}</div>
      {helper ? <div className="mt-2 text-sm text-slate-400">{helper}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-white/5 px-6 text-center">
      <div className="mb-3 h-12 w-12 rounded-2xl border border-slate-800 bg-white/5" />
      <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
