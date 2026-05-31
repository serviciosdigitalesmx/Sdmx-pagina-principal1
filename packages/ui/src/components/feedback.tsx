"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { ...toast, id }]);
  };

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [toasts]);

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => {
          const toneClasses =
            toast.tone === "success"
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-50"
              : toast.tone === "error"
                ? "border-rose-500/30 bg-rose-500/15 text-rose-50"
                : "border-sky-500/30 bg-sky-500/15 text-sky-50";

          return (
            <div key={toast.id} className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${toneClasses}`}>
              <div className="text-sm font-semibold">{toast.title}</div>
              {toast.description ? <div className="mt-1 text-sm leading-6 opacity-90">{toast.description}</div> : null}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/8 ${className}`} />;
}

export function LoadingState({
  title = "Cargando…",
  description = "Estamos trayendo los datos reales del tenant.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/5" />
        <Skeleton className="h-4 w-4/5" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
      <div className="mt-4 text-sm text-zinc-400">
        <div className="font-semibold text-zinc-200">{title}</div>
        <div className="mt-1">{description}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Confirmación requerida</div>
        <h3 className="mt-3 text-2xl font-semibold text-zinc-50">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-full border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            className={[
              "min-h-11 rounded-full px-4 py-3 text-sm font-semibold text-white transition",
              danger ? "bg-rose-600 hover:bg-rose-500" : "bg-sky-600 hover:bg-sky-500",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

