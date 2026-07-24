'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, ChevronDown, Building2, Menu } from 'lucide-react';
import { BranchSelector } from './branch-selector';
import { logout } from '@/lib/auth';
import { getCustomerLabel } from '@/lib/labels';
import type { User as UserType } from '@/types';
import { useTenantIdentity } from '@/providers/TenantIdentityProvider';
import { readAuthToken } from '@/lib/auth-storage';
import { listOfflineRequests, replayOfflineRequests } from '@/lib/pwa/offline-queue';

interface HeaderProps {
  user: UserType;
  onMenuClick?: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { identity } = useTenantIdentity();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [queuedOfflineRequests, setQueuedOfflineRequests] = useState(0);
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

  const refreshOfflineState = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsOnline(window.navigator.onLine);

    try {
      const pending = await listOfflineRequests();
      setQueuedOfflineRequests(pending.length);
    } catch {
      setQueuedOfflineRequests(0);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    void refreshOfflineState();

    const handleOnline = () => {
      setIsOnline(true);
      const token = readAuthToken();
      if (token) {
        void replayOfflineRequests(() => token).finally(() => void refreshOfflineState());
        return;
      }
      void refreshOfflineState();
    };

    const handleOffline = () => {
      setIsOnline(false);
      void refreshOfflineState();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshOfflineState]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 transition hover:bg-slate-100 lg:hidden"
            aria-label="Abrir navegación"
          >
            <Menu className="h-5 w-5" />
          </button>
          <BranchSelector />
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
            title="Volver al hub"
          >
            <Building2 className="h-4 w-4 text-slate-900" />
            Hub
          </Link>
        </div>

        <div className="hidden min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 md:flex">
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'} shadow-[0_0_8px_currentColor]`} />
          <Building2 className="h-4 w-4 text-slate-900" />
          <span className="truncate">{identity?.tenantName || 'Mi taller'}</span>
        </div>
        {(queuedOfflineRequests > 0 || !isOnline) ? (
          <div className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 md:flex">
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            {isOnline ? `${queuedOfflineRequests} cambios pendientes` : `Sin conexión${queuedOfflineRequests ? ` · ${queuedOfflineRequests} pendientes` : ''}`}
          </div>
        ) : null}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
              <User className="w-4 h-4 text-slate-900" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-sm font-medium text-slate-900">{user.name || user.email}</p>
              <p className="text-xs text-slate-500">{roleLabels[user.role] || user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-100 p-3">
                  <p className="text-sm font-medium truncate text-slate-900">{user.email}</p>
                  <p className="text-xs text-slate-500 mt-1">Tenant: {identity?.tenantName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
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
