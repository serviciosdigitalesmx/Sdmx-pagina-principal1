"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { RequireRole } from "@/components/guard/RequireRole";
import { useAuth } from "@/components/guard/use-auth";
import { ModuleShell } from "@/components/dashboard/module-shell";
import { fixService } from "@/services/fixService";

type SupplierRow = {
  id?: string;
  business_name?: string;
  nombre?: string;
  rfc?: string | null;
  legal_name?: string | null;
  contact_name?: string | null;
  phone?: string | null;
  telefono?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  direccion?: string | null;
  city?: string | null;
  state?: string | null;
  categories?: string | null;
  lead_time_days?: number | null;
  payment_terms?: string | null;
  condiciones_pago?: string | null;
  notes?: string | null;
  is_active?: boolean | string | null;
  estatus?: "active" | "inactive";
  created_at?: string | null;
  updated_at?: string | null;
};

type PurchaseOrderRow = {
  id?: string;
  folio?: string;
  status?: string;
  reference?: string | null;
  expected_date?: string | null;
  total?: number | string | null;
  created_at?: string | null;
};

type SupplierFormState = {
  businessName: string;
  rfc: string;
  legalName: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  categories: string;
  paymentTerms: string;
  notes: string;
};

const emptyForm: SupplierFormState = {
  businessName: "",
  rfc: "",
  legalName: "",
  contactName: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  state: "",
  categories: "",
  paymentTerms: "",
  notes: "",
};

const pageSize = 20;

function supplierName(row: SupplierRow) {
  return row.business_name ?? row.nombre ?? "";
}

function supplierPhone(row: SupplierRow) {
  return row.phone ?? row.telefono ?? "";
}

function supplierAddress(row: SupplierRow) {
  return row.address ?? row.direccion ?? "";
}

function supplierPaymentTerms(row: SupplierRow) {
  return row.payment_terms ?? row.condiciones_pago ?? "";
}

function isActive(row: SupplierRow) {
  return row.is_active === true || row.is_active === "true" || row.estatus === "active";
}

function formatCurrency(value?: number | string | null) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export default function ProveedoresPage() {
  const { role } = useAuth();
  const [rows, setRows] = useState<SupplierRow[]>([]);
  const [history, setHistory] = useState<PurchaseOrderRow[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchRfc, setSearchRfc] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [sortKey, setSortKey] = useState<"business_name" | "rfc" | "status">("business_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [form, setForm] = useState<SupplierFormState>(emptyForm);

  const selected = useMemo(() => rows.find((row) => row.id === selectedId) ?? null, [rows, selectedId]);

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setError("No se pudo copiar el texto.");
    }
  }

  async function loadSuppliers(nextPage = page) {
    try {
      setLoading(true);
      setError("");
      const result = await fixService.getSuppliers({
        page: nextPage,
        pageSize,
        name: searchName.trim() || undefined,
        rfc: searchRfc.trim() || undefined,
      });
      const typedRows = result as unknown as SupplierRow[];
      setRows(typedRows);
      setPage(result.page);
      setTotal(result.total);
      setHasMore(result.hasMore);
      const nextSelected = typedRows.find((item) => item.id === selectedId) ?? typedRows[0] ?? null;
      if (nextSelected?.id) {
        setSelectedId(nextSelected.id);
      } else {
        setSelectedId("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(supplierId: string) {
    if (!supplierId) {
      setHistory([]);
      return;
    }

    try {
      setHistoryLoading(true);
      const data = await fixService.getSupplierPurchaseOrders(supplierId);
      setHistory(data as PurchaseOrderRow[]);
    } catch (err) {
      setHistory([]);
      setError(err instanceof Error ? err.message : "Error al cargar historial de compras");
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSuppliers(1);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setHistory([]);
      return;
    }
    void loadHistory(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSuppliers(1);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName, searchRfc]);

  useEffect(() => {
    if (selected) {
      setForm({
        businessName: supplierName(selected),
        rfc: selected.rfc ?? "",
        legalName: selected.legal_name ?? "",
        contactName: selected.contact_name ?? "",
        phone: supplierPhone(selected),
        whatsapp: selected.whatsapp ?? "",
        email: selected.email ?? "",
        address: supplierAddress(selected),
        city: selected.city ?? "",
        state: selected.state ?? "",
        categories: selected.categories ?? "",
        paymentTerms: supplierPaymentTerms(selected),
        notes: selected.notes ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const sortedRows = useMemo(() => {
    const list = [...rows];
    const getValue = (row: SupplierRow) => {
      if (sortKey === "rfc") return (row.rfc ?? "").toLowerCase();
      if (sortKey === "status") return isActive(row) ? "active" : "inactive";
      return supplierName(row).toLowerCase();
    };

    list.sort((a, b) => {
      const left = getValue(a);
      const right = getValue(b);
      if (left < right) return sortDirection === "asc" ? -1 : 1;
      if (left > right) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [rows, sortDirection, sortKey]);

  const stats = useMemo(
    () => [
      { label: "Activos", value: String(rows.filter((item) => isActive(item)).length), helper: "Registros visibles." },
      { label: "Totales", value: String(total), helper: "Conteo real paginado." },
      { label: "Selección", value: selected?.business_name ?? selected?.nombre ?? "Ninguno", helper: "Proveedor actual." },
    ],
    [rows, selected, total],
  );

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const payload = {
        businessName: form.businessName.trim(),
        rfc: form.rfc.trim(),
        legalName: form.legalName.trim(),
        contactName: form.contactName.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        categories: form.categories.trim(),
        paymentTerms: form.paymentTerms.trim(),
        notes: form.notes.trim(),
      };

      if (selected?.id) {
        await fixService.updateSupplier(selected.id, payload);
      } else {
        await fixService.createSupplier(payload);
      }

      setShowModal(false);
      await loadSuppliers(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el proveedor");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(row: SupplierRow) {
    if (!row.id) return;
    try {
      setSaving(true);
      setError("");
      await fixService.updateSupplierStatus(row.id, isActive(row) ? "inactive" : "active");
      await loadSuppliers(page);
      await loadHistory(selectedId || row.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el estatus");
    } finally {
      setSaving(false);
    }
  }

  function openCreateModal() {
    setSelectedId("");
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(row: SupplierRow) {
    if (!row.id) return;
    setSelectedId(row.id);
    setShowModal(true);
  }

  return (
    <RequireRole allowed={["owner", "manager"]}>
      <ModuleShell
        title="Proveedores"
        subtitle="Catálogo real con historial de compras por proveedor."
        icon="fas fa-truck"
        actionLabel="Nuevo proveedor"
        onAction={openCreateModal}
        secondaryActionLabel="Actualizar"
        secondaryOnAction={() => void loadSuppliers(page)}
        stats={stats}
        loading={loading}
        columns={[
          { label: "Proveedor", key: "business_name" },
          { label: "RFC", key: "rfc" },
          { label: "Contacto", key: "contact_name" },
          { label: "Estado", key: "estatus" },
        ]}
        rows={sortedRows.map((row) => ({
          business_name: supplierName(row),
          rfc: row.rfc ?? "",
          contact_name: row.contact_name ?? "",
          estatus: isActive(row) ? "Activo" : "Inactivo",
        }))}
        emptyTitle={loading ? "Cargando proveedores…" : error ? "No pudimos cargar proveedores" : "No hay proveedores registrados"}
        emptyCopy={error || "La lista real sale de /api/:tenantSlug/suppliers con filtros y paginación."}
      >
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-1 text-sm text-zinc-300">
                <span>Filtrar por nombre</span>
                <input
                  value={searchName}
                  onChange={(event) => setSearchName(event.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none"
                  placeholder="Buscar proveedor"
                />
              </label>
              <label className="space-y-1 text-sm text-zinc-300">
                <span>Filtrar por RFC</span>
                <input
                  value={searchRfc}
                  onChange={(event) => setSearchRfc(event.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none"
                  placeholder="RFC"
                />
              </label>
              <label className="space-y-1 text-sm text-zinc-300">
                <span>Ordenar</span>
                <select
                  value={`${sortKey}:${sortDirection}`}
                  onChange={(event) => {
                    const [key, direction] = event.target.value.split(":") as ["business_name" | "rfc" | "status", "asc" | "desc"];
                    setSortKey(key);
                    setSortDirection(direction);
                  }}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none"
                >
                  <option value="business_name:asc">Nombre A-Z</option>
                  <option value="business_name:desc">Nombre Z-A</option>
                  <option value="rfc:asc">RFC A-Z</option>
                  <option value="rfc:desc">RFC Z-A</option>
                  <option value="status:asc">Estado activo primero</option>
                  <option value="status:desc">Estado inactivo primero</option>
                </select>
              </label>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => void loadSuppliers(1)}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100"
                >
                  Aplicar filtros
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchName("");
                    setSearchRfc("");
                    setPage(1);
                  }}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                <thead className="bg-zinc-900/80 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Proveedor</th>
                    <th className="px-4 py-3 font-medium">RFC</th>
                    <th className="px-4 py-3 font-medium">Contacto</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {sortedRows.map((row) => (
                    <tr key={row.id} className={`bg-zinc-950 ${selectedId === row.id ? "ring-1 ring-amber-500/30" : ""}`}>
                      <td className="px-4 py-3 text-zinc-200">
                        <button type="button" onClick={() => row.id ? setSelectedId(row.id) : null} className="text-left">
                          <div className="font-medium text-zinc-50">{supplierName(row)}</div>
                          <div className="text-xs text-zinc-500">{row.categories || "Sin categorías"}</div>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{row.rfc || "Sin RFC"}</td>
                      <td className="px-4 py-3 text-zinc-300">
                        <div>{row.contact_name || "Sin contacto"}</div>
                        <div className="text-xs text-zinc-500">{supplierPhone(row) || "Sin teléfono"}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{isActive(row) ? "Activo" : "Inactivo"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-200"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleToggleStatus(row)}
                            className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-200"
                            disabled={saving}
                          >
                            {isActive(row) ? "Desactivar" : "Activar"}
                          </button>
                          {supplierPhone(row) ? (
                            <button
                              type="button"
                              onClick={() => void copyText(supplierPhone(row), `Teléfono ${supplierName(row)}`)}
                              className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-200"
                            >
                              Copiar tel.
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
              <div>
                Página {page} · {rows.length} visibles de {total}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => void loadSuppliers(page - 1)}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={!hasMore || loading}
                  onClick={() => void loadSuppliers(page + 1)}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>

            {copied ? <p className="mt-3 text-xs uppercase tracking-[0.18em] text-emerald-300">{copied}</p> : null}
          </section>

          <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-50">Historial de compras</h2>
                <p className="text-sm text-zinc-400">{selected?.business_name ?? selected?.nombre ?? "Selecciona un proveedor"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selected && isActive(selected) ? "bg-emerald-500/10 text-emerald-200" : "bg-zinc-800 text-zinc-300"}`}>
                {selected && isActive(selected) ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-300">
              <div className="grid gap-2">
                <div><span className="text-zinc-500">RFC:</span> {selected?.rfc ?? "Sin RFC"}</div>
                <div><span className="text-zinc-500">Contacto:</span> {selected?.contact_name ?? "Sin contacto"}</div>
                <div><span className="text-zinc-500">Teléfono:</span> {supplierPhone(selected ?? {}) || "Sin teléfono"}</div>
                <div><span className="text-zinc-500">Dirección:</span> {supplierAddress(selected ?? {}) || "Sin dirección"}</div>
                <div><span className="text-zinc-500">Condiciones de pago:</span> {supplierPaymentTerms(selected ?? {}) || "Sin condiciones"}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Órdenes de compra</h3>
                <button
                  type="button"
                  onClick={() => selected?.id ? void loadHistory(selected.id) : null}
                  className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-200"
                >
                  Refrescar
                </button>
              </div>

              {historyLoading ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">Cargando historial…</div>
              ) : history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item) => (
                    <article key={item.id ?? item.folio} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-zinc-50">{item.folio ?? "Sin folio"}</div>
                          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.status ?? "Sin estado"}</div>
                        </div>
                        <div className="text-right text-sm text-zinc-300">
                          <div>{formatCurrency(item.total)}</div>
                          <div className="text-xs text-zinc-500">{item.expected_date ? String(item.expected_date) : "Sin fecha"}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-zinc-400">{item.reference || "Sin referencia"}</div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
                  No hay historial de compras para este proveedor.
                </div>
              )}
            </div>
          </section>
        </div>

        {showModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-50">{selected?.id ? "Editar proveedor" : "Nuevo proveedor"}</h2>
                  <p className="text-sm text-zinc-400">Alta/edición contra backend real.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-zinc-700 px-3 py-1 text-sm text-zinc-200"
                >
                  Cerrar
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  ["businessName", "Razón social"],
                  ["rfc", "RFC"],
                  ["legalName", "Nombre legal"],
                  ["contactName", "Contacto"],
                  ["phone", "Teléfono"],
                  ["whatsapp", "WhatsApp"],
                  ["email", "Correo"],
                  ["address", "Dirección"],
                  ["city", "Ciudad"],
                  ["state", "Estado"],
                  ["categories", "Categorías"],
                  ["paymentTerms", "Condiciones de pago"],
                ].map(([key, label]) => (
                  <label key={key} className="space-y-1 text-sm text-zinc-300">
                    <span>{label}</span>
                    <input
                      value={form[key as keyof SupplierFormState]}
                      onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none"
                    />
                  </label>
                ))}
                <label className="space-y-1 text-sm text-zinc-300 md:col-span-2">
                  <span>Notas</span>
                  <textarea
                    value={form.notes}
                    onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                    className="min-h-28 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none"
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-slate-400 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60"
                  >
                    {saving ? "Guardando…" : "Guardar proveedor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </ModuleShell>
    </RequireRole>
  );
}
