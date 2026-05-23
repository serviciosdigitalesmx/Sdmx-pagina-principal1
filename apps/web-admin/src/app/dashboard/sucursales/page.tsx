"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireRole } from "@/components/guard/RequireRole";
import { useAuth } from "@/components/guard/use-auth";
import { ModuleShell } from "@/components/dashboard/module-shell";
import { fixService } from "@/services/fixService";

type BranchRow = {
  id?: string;
  name?: string;
  code?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  address?: string | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export default function SucursalesPage() {
  const { role, sucursalId } = useAuth();
  const [rows, setRows] = useState<BranchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await fixService.getBranches();
        if (!cancelled) setRows(data as BranchRow[]);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar sucursales");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeRows = useMemo(() => rows.filter((row) => row.is_active !== false), [rows]);
  const selectedBranch = rows.find((row) => row.id === sucursalId) ?? null;

  return (
    <RequireRole allowed={["owner", "manager"]}>
      <ModuleShell
        title="Sucursales"
        subtitle="Control real de sucursales del tenant con aislamiento por branch_id."
        icon="fas fa-store"
        actionLabel={role === "owner" ? "Agregar sucursal" : "Ver sucursal actual"}
        stats={[
          { label: "Sucursales", value: String(rows.length), helper: "Cargadas desde la API real." },
          { label: "Activas", value: String(activeRows.length), helper: "Filtrado por is_active." },
          { label: "Contexto", value: selectedBranch?.name ?? sucursalId ?? "N/D", helper: "Sucursal del usuario o selector global." },
        ]}
        columns={[
          { label: "Nombre", key: "nombre" },
          { label: "Código", key: "code" },
          { label: "Ciudad", key: "city" },
          { label: "Estado", key: "state" },
        ]}
        rows={rows.map((row) => ({
          nombre: row.name ?? "-",
          code: row.code ?? "-",
          city: row.city ?? "-",
          state: row.state ?? "-",
        }))}
        emptyTitle={loading ? "Cargando sucursales…" : error ? "No pudimos cargar sucursales" : "Sin sucursales todavía"}
        emptyCopy={error || "El módulo consume /api/:tenantId/branches y respeta tenant_id en producción."}
      />
    </RequireRole>
  );
}
