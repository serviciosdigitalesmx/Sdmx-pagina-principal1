'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, ChevronDown, Building2, Menu } from 'lucide-react';
import { BranchSelector } from './branch-selector';
import { logout } from '@/lib/auth';
import { getCustomerLabel } from '@/lib/labels';
import type { User as UserType } from '@/types';
import { useTenantIdentity } from '@/providers/TenantIdentityProvider';

interface HeaderProps {
  user: UserType;
  onMenuClick?: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { identity } = useTenantIdentity();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const customerLabel = getCustomerLabel();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const roleLabels: Record<string, string> = {
    owner: 'Dueño',
    manager: 'Gerente',
    technician: 'Técnico',
    client: customerLabel,
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-slate-100 transition hover:bg-slate-800 lg:hidden"
            aria-label="Abrir navegación"
          >
            <Menu className="h-5 w-5" />
          </button>
          <BranchSelector />
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 md:inline-flex"
            title="Volver al hub"
          >
            <Building2 className="h-4 w-4 text-sky-400" />
            Hub
          </Link>
        </div>

        <div className="hidden min-w-0 items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-400 md:flex">
          <Building2 className="h-4 w-4 text-sky-400" />
          <span className="truncate">{identity?.tenantName || 'Mi taller'}</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 transition hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15">
              <User className="w-4 h-4 text-sky-400" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-sm font-medium">{user.name || user.email}</p>
              <p className="text-xs text-slate-400">{roleLabels[user.role] || user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
                <div className="border-b border-slate-800 p-3">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-slate-400 mt-1">Tenant: {identity?.tenantName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
