"use client";

import Link from 'next/link';
import React from 'react';
import { useAuth, type Role } from './use-auth';

interface ProtectedLinkProps {
  to: string;
  label: string;
  allowedRoles: Role[];
  badge?: string;
  className?: string;
}

export function ProtectedLink({ to, label, allowedRoles, badge, className }: ProtectedLinkProps) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return (
    <Link href={to} className={className}>
      <span className="flex items-center gap-2">
        <span>{label}</span>
        {badge ? (
          <span className="rounded-full border border-zinc-700/80 bg-zinc-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {badge}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
