'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Search, Edit2, Phone, Mail, Truck, Power, Trash2, X } from 'lucide-react';
import { Badge, SurfaceCard } from '@white-label/ui';
import { procurementService } from '@/services/procurement/procurementService';

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
  categories?: string | null;
  payment_terms?: string | null;
  condiciones_pago?: string | null;
  notes?: string | null;
  is_active?: boolean | string | null;
};

type SupplierForm = {
  business_name: string;
  contact_name: string;
  phone: string;
  email: string;
  address: string;
  categories: string;
  payment_terms: string;
  notes: string;
};

const INITIAL_FORM: SupplierForm = {
  business_name: '',
  contact_name: '',
  phone: '',
  email: '',
  address: '',
  categories: '',
  payment_terms: '',
  notes: '',
};

function supplierName(row: SupplierRow) {
  return row.business_name ?? row.nombre ?? 'Proveedor sin nombre';
}

function supplierPhone(row: SupplierRow) {
  return row.phone ?? row.telefono ?? '';
}

function paymentTerms(row: SupplierRow) {
  return row.payment_terms ?? row.condiciones_pago ?? 'Sin termino';
}

function isActive(row: SupplierRow) {
  return row.is_active === true || row.is_active === 'true';
}

function toForm(row: SupplierRow): SupplierForm {
  return {
    business_name: supplierName(row),
    contact_name: row.contact_name ?? '',
    phone: supplierPhone(row),
    email: row.email ?? '',
    address: row.address ?? row.direccion ?? '',
    categories: row.categories ?? '',
    payment_terms: row.payment_terms ?? row.condiciones_pago ?? '',
    notes: row.notes ?? '',
  };
}

export default function ProveedoresPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SupplierRow[]>([]);
  const [filtered, setFiltered] = useState<SupplierRow[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SupplierRow | null>(null);
  const [form, setForm] = useState<SupplierForm>(INITIAL_FORM);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await procurementService.getSuppliers();
      const list = data as SupplierRow[];
      setRows(list);
      setFiltered(list);
      setError('');
    } catch (err) {
      setRows([]);
      setFiltered([]);
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers();
  }, []);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFiltered(rows);
      return;
    }
    setFiltered(
      rows.filter((row) =>
        [supplierName(row), row.rfc ?? '', supplierPhone(row), row.email ?? '', row.categories ?? '']
          .join(' ')
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [rows, search]);

  const activeCount = useMemo(() => filtered.filter((row) => isActive(row)).length, [filtered]);

  function openCreate() {
    setEditing(null);
    setForm(INITIAL_FORM);
    setShowForm(true);
  }

  function openEdit(row: SupplierRow) {
    setEditing(row);
    setForm(toForm(row));
    setShowForm(true);
  }

  async function submitSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      const payload = {
        business_name: form.business_name.trim(),
        contact_name: form.contact_name.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        categories: form.categories.trim() || null,
        payment_terms: form.payment_terms.trim() || null,
        notes: form.notes.trim() || null,
      };
      if (editing?.id) {
        await procurementService.updateSupplier(editing.id, payload);
      } else {
        await procurementService.createSupplier(payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm(INITIAL_FORM);
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el proveedor');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(row: SupplierRow) {
    if (!row.id) return;
    try {
      setError('');
      await procurementService.updateSupplierStatus(row.id, isActive(row) ? 'inactive' : 'active');
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado');
    }
  }

  async function removeSupplier(row: SupplierRow) {
    if (!row.id) return;
    if (!window.confirm(`Eliminar a ${supplierName(row)}?`)) return;
    try {
      setError('');
      await procurementService.deleteSupplier(row.id);
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el proveedor');
    }
  }

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
        <p className="font-semibold">No se pudieron cargar los proveedores</p>
        <p className="mt-2 text-rose-100/80">{error}</p>
        <button
          type="button"
          onClick={() => void loadSuppliers()}
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
          <h1 className="text-2xl font-semibold text-slate-50">Proveedores</h1>
          <p className="mt-1 text-sm text-slate-400">{filtered.length} visibles · {activeCount} activos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void loadSuppliers()} className="btn-outline gap-2 inline-flex items-center">
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <button onClick={openCreate} className="btn-primary gap-2 inline-flex items-center">
            <Plus className="w-4 h-4" />
            Nuevo proveedor
          </button>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div> : null}

      {showForm ? (
        <SurfaceCard elevated className="space-y-4 p-4">
          <form onSubmit={submitSupplier} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">{editing ? 'Editar proveedor' : 'Nuevo proveedor'}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost inline-flex items-center gap-2 text-slate-400">
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={form.business_name} onChange={(e) => setForm((current) => ({ ...current, business_name: e.target.value }))} className="input" placeholder="Razón social / nombre" required />
            <input value={form.contact_name} onChange={(e) => setForm((current) => ({ ...current, contact_name: e.target.value }))} className="input" placeholder="Contacto" />
            <input value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} className="input" placeholder="Teléfono" />
            <input value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} className="input" placeholder="Email" type="email" />
            <input value={form.categories} onChange={(e) => setForm((current) => ({ ...current, categories: e.target.value }))} className="input" placeholder="Categorías" />
            <input value={form.payment_terms} onChange={(e) => setForm((current) => ({ ...current, payment_terms: e.target.value }))} className="input" placeholder="Términos de pago" />
            <textarea value={form.address} onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))} className="input min-h-24 md:col-span-2" placeholder="Dirección" />
            <textarea value={form.notes} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} className="input min-h-24 md:col-span-2" placeholder="Notas" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar proveedor'}</button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
          </form>
        </SurfaceCard>
      ) : null}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" placeholder="Buscar por nombre, RFC, categoria o contacto..." />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((supplier) => (
          <SurfaceCard key={supplier.id} elevated className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-50">{supplierName(supplier)}</h3>
                <p className="text-xs text-slate-400">{supplier.rfc || 'RFC sin capturar'}</p>
              </div>
              <Badge variant={isActive(supplier) ? 'success' : 'danger'}>{isActive(supplier) ? 'Activo' : 'Inactivo'}</Badge>
            </div>

            <div className="grid gap-2 text-sm text-slate-400">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-sky-300" /><span>{supplier.categories || 'Sin categorias'}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-sky-300" /><span>{supplierPhone(supplier) || 'Sin telefono'}</span></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-300" /><span>{supplier.email || 'Sin email'}</span></div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm">
              <div className="text-slate-400">Terminos de pago</div>
              <div className="mt-1 text-slate-200">{paymentTerms(supplier)}</div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-400">{supplier.address ?? supplier.direccion ?? 'Direccion no capturada'}</div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-ghost inline-flex items-center gap-2 text-sky-300" onClick={() => openEdit(supplier)}>
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button className="btn-ghost inline-flex items-center gap-2 text-amber-300" onClick={() => void toggleStatus(supplier)}>
                  <Power className="w-4 h-4" />
                  {isActive(supplier) ? 'Desactivar' : 'Activar'}
                </button>
                <button className="btn-ghost inline-flex items-center gap-2 text-red-400" onClick={() => void removeSupplier(supplier)}>
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          </SurfaceCard>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No hay proveedores con esos filtros.</div>
      ) : null}
    </div>
  );
}
