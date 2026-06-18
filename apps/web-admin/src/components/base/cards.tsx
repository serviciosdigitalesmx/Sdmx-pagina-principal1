'use client';

import type { ReactNode } from 'react';
import { SurfaceCard } from '@white-label/ui';

export function BaseCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <SurfaceCard elevated className={`p-4 ${className}`}>{children}</SurfaceCard>;
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
    <SurfaceCard elevated className={`p-4 ${accent ? 'border-sky-400/20' : ''}`}>
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className="mt-3 text-[2rem] font-black tracking-tight text-slate-50">{value}</div>
      {helper ? <div className="mt-2 text-sm text-slate-400">{helper}</div> : null}
    </SurfaceCard>
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
    <SurfaceCard subtle className="flex min-h-[240px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 h-12 w-12 rounded-2xl border border-white/10 bg-white/5" />
      <h3 className="text-lg font-semibold tracking-tight text-slate-50">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </SurfaceCard>
  );
}
