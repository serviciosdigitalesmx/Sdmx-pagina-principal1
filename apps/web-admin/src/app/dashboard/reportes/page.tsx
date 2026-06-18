"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, LineChart, RefreshCw, Users, Package, Wallet } from "lucide-react";
import { Badge, SurfaceCard } from "@white-label/ui";
import { getActiveScope } from "@/lib/scope";
import { reportsService } from "@/services/reports/reportsService";

type ReportsSummary = {
  ordersCount: number;
  customersCount: number;
  inventoryCount: number;
  lowStockCount: number;
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  productivity?: number;
  inventoryValuation?: number;
  accountsReceivable?: number;
  ordersByTechnician?: Record<string, number>;
  statusCounts: Record<string, number>;
  lastUpdatedAt: string | null;
};

function currency(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
}

export default function ReportesPage() {
  const scope = getActiveScope();
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = (await reportsService.getReportsSummary()) as ReportsSummary;
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar reportes");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    void load();
  }, [scope?.mode, scope?.sucursalId]);

  const statusRows = useMemo(() => {
    const counts = summary?.statusCounts ?? {};
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [summary?.statusCounts]);

  const technicianRows = useMemo(() => {
    const byTech = summary?.ordersByTechnician ?? {};
    return Object.entries(byTech).sort((a, b) => b[1] - a[1]);
  }, [summary?.ordersByTechnician]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
        <p className="font-semibold">No se pudieron cargar los reportes</p>
        <p className="mt-2 text-rose-100/80">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-2xl border border-rose-500/20 bg-slate-950/70 px-4 py-2 font-semibold text-rose-100"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Reportes</h1>
          <p className="mt-1 text-sm text-slate-400">Resumen operativo real del tenant y de la sucursal activa.</p>
        </div>
        <button onClick={() => void load()} className="btn-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SurfaceCard elevated className="p-5 text-center">
          <BarChart3 className="mx-auto h-5 w-5 text-sky-300" />
          <div className="mt-3 text-3xl font-bold text-slate-50">{summary?.ordersCount ?? 0}</div>
          <div className="text-xs text-slate-400">Órdenes</div>
        </SurfaceCard>
        <SurfaceCard elevated className="p-5 text-center">
          <Users className="mx-auto h-5 w-5 text-sky-300" />
          <div className="mt-3 text-3xl font-bold text-slate-50">{summary?.customersCount ?? 0}</div>
          <div className="text-xs text-slate-400">Clientes</div>
        </SurfaceCard>
        <SurfaceCard elevated className="p-5 text-center">
          <Package className="mx-auto h-5 w-5 text-sky-300" />
          <div className="mt-3 text-3xl font-bold text-sky-300">{summary?.inventoryCount ?? 0}</div>
          <div className="text-xs text-slate-400">Items de inventario</div>
        </SurfaceCard>
        <SurfaceCard elevated className="p-5 text-center">
          <Wallet className="mx-auto h-5 w-5 text-sky-300" />
          <div className="mt-3 text-3xl font-bold text-sky-300">{currency(summary?.totalBalance ?? 0)}</div>
          <div className="text-xs text-slate-400">Balance visible</div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SurfaceCard elevated className="p-5">
          <div className="mb-4 flex items-center gap-2 text-sky-300">
            <LineChart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Estados de órdenes</h2>
          </div>
          <div className="space-y-3">
            {statusRows.length > 0 ? statusRows.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-200">{status}</span>
                  <Badge variant="primary">{count}</Badge>
                </div>
            )) : <div className="text-sm text-slate-400">Sin datos de estados todavía.</div>}
          </div>
        </SurfaceCard>

        <SurfaceCard elevated className="p-5">
          <div className="mb-4 flex items-center gap-2 text-sky-300">
            <Users className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Órdenes por técnico</h2>
          </div>
          <div className="space-y-3">
            {technicianRows.length > 0 ? technicianRows.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-slate-200">{name}</span>
                <Badge variant="warning">{count}</Badge>
              </div>
            )) : <div className="text-sm text-slate-400">No hay técnicos asignados todavía.</div>}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <SurfaceCard elevated className="p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Productividad</div>
          <div className="mt-3 text-2xl font-bold text-slate-50">{Math.round(Number(summary?.productivity ?? 0))}%</div>
        </SurfaceCard>
        <SurfaceCard elevated className="p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Valuación</div>
          <div className="mt-3 text-2xl font-bold text-slate-50">{currency(summary?.inventoryValuation ?? 0)}</div>
        </SurfaceCard>
        <SurfaceCard elevated className="p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Cuentas por cobrar</div>
          <div className="mt-3 text-2xl font-bold text-slate-50">{currency(summary?.accountsReceivable ?? 0)}</div>
        </SurfaceCard>
        <SurfaceCard elevated className="p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Última actualización</div>
          <div className="mt-3 text-sm font-semibold text-slate-200">
            {mounted && summary?.lastUpdatedAt ? new Date(summary.lastUpdatedAt).toLocaleString("es-MX") : "No disponible"}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
