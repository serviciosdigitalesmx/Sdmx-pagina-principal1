"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, RefreshCw, Search, PackageCheck } from "lucide-react";
import { ordersService } from "@/services/orders/ordersService";

type ArchiveRow = {
  id?: string;
  folio: string;
  client: string;
  cierre: string;
  estado: string;
};

function normalizeStatus(value: string) {
  if (!value) return "cerrada";
  const lower = value.toLowerCase();
  if (lower.includes("cancel")) return "cancelada";
  if (lower.includes("entreg")) return "entregada";
  if (lower.includes("list")) return "lista";
  return value;
}

function resolveCloseDate(order: Record<string, unknown>) {
  const date = String(order.updated_at ?? order.created_at ?? "");
  return date ? new Date(date).toLocaleDateString("es-MX") : "No disponible";
}

function badgeClass(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("cancel")) return "badge-cancelado";
  if (lower.includes("entreg")) return "badge-listo";
  if (lower.includes("list")) return "badge-diagnostico";
  return "badge-recibido";
}

export default function ArchivoPage() {
  const [rows, setRows] = useState<ArchiveRow[]>([]);
  const [filtered, setFiltered] = useState<ArchiveRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setLoading(true);
      setError("");
      const data = await ordersService.getOrders();
      const archived = (data as Array<Record<string, unknown>>)
        .filter((order) => {
          const status = String(order.status ?? "").toLowerCase();
          return ["list", "entreg", "cerr", "complete", "ready", "delivered", "waiting"].some((value) => status.includes(value));
        })
        .map((order) => ({
          id: String(order.id ?? order.folio ?? ""),
          folio: String(order.folio ?? "Sin folio"),
          client: String((order.device_info as { customer_name?: string } | undefined)?.customer_name ?? order.customer_name ?? "Cliente no disponible"),
          cierre: resolveCloseDate(order),
          estado: normalizeStatus(String(order.status ?? "")),
        }));
      setRows(archived);
      setFiltered(archived);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar archivo");
      setRows([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFiltered(rows);
      return;
    }
    setFiltered(
      rows.filter((row) => [row.folio, row.client, row.estado].join(" ").toLowerCase().includes(term)),
    );
  }, [rows, search]);

  const deliveredCount = useMemo(
    () => filtered.filter((row) => row.estado.toLowerCase().includes("entreg")).length,
    [filtered],
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  if (error && rows.length === 0) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
        <p className="font-semibold">No se pudo cargar el archivo</p>
        <p className="mt-2 text-rose-100/80">{error}</p>
        <button
          type="button"
          onClick={() => void refresh()}
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
          <h1 className="text-2xl font-semibold text-slate-50">Archivo</h1>
          <p className="mt-1 text-sm text-slate-400">{filtered.length} órdenes cerradas · {deliveredCount} entregadas</p>
        </div>
        <button onClick={() => void refresh()} className="btn-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card text-center">
          <Archive className="mx-auto h-5 w-5 text-sky-300" />
          <div className="mt-3 text-3xl font-bold text-slate-50">{filtered.length}</div>
          <div className="text-xs text-slate-400">Órdenes en archivo</div>
        </div>
        <div className="card text-center">
          <PackageCheck className="mx-auto h-5 w-5 text-sky-300" />
          <div className="mt-3 text-3xl font-bold text-sky-300">{deliveredCount}</div>
          <div className="text-xs text-slate-400">Entregadas</div>
        </div>
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input pl-9"
              placeholder="Buscar por folio, cliente o estado..."
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950/70">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800 bg-slate-950/70 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Folio</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Cierre</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id ?? row.folio} className="border-b border-slate-800/80 hover:bg-slate-900/40">
                <td className="px-4 py-3 font-mono text-sky-300">{row.folio}</td>
                <td className="px-4 py-3 text-slate-200">{row.client}</td>
                <td className="px-4 py-3 text-slate-400">{row.cierre}</td>
                <td className="px-4 py-3"><span className={badgeClass(row.estado)}>{row.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No hay órdenes cerradas o entregadas para mostrar.</div>
        ) : null}
      </div>
    </div>
  );
}
