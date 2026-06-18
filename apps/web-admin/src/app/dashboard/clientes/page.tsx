'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, RefreshCw, Edit2, Eye, Trash2, Phone, MessageSquare, Wrench } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerModal } from '@/components/clientes/customer-modal';
import { CustomerHistory } from '@/components/clientes/customer-history';
import { useTenantIdentity } from '@/providers/TenantIdentityProvider';
import type { Customer } from '@/types';

export default function ClientesPage() {
  const router = useRouter();
  const { identity, isLoading: identityLoading } = useTenantIdentity();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [duplicatePhones, setDuplicatePhones] = useState<string[]>([]);
  const [duplicateNames, setDuplicateNames] = useState<string[]>([]);

  const getCustomerDisplayName = (customer: Customer) => customer.full_name || customer.name;

  const loadCustomers = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await apiClient.get<{ data: Customer[] }>('/customers', getApiOptions());
      const customersList = data.data || [];

      // Detectar teléfonos y nombres duplicados
      const phoneMap = new Map<string, number>();
      const nameMap = new Map<string, number>();
      customersList.forEach((c) => {
        if (c.phone) {
          const normalizedPhone = c.phone.replace(/\D/g, '');
          phoneMap.set(normalizedPhone, (phoneMap.get(normalizedPhone) || 0) + 1);
        }
        const normalizedName = getCustomerDisplayName(c).trim().toLowerCase();
        if (normalizedName) {
          nameMap.set(normalizedName, (nameMap.get(normalizedName) || 0) + 1);
        }
      });
      const dupPhones = Array.from(phoneMap.entries())
        .filter(([_, count]) => count > 1)
        .map(([phone]) => phone);
      const dupNames = Array.from(nameMap.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name);

      setCustomers(customersList);
      setFilteredCustomers(customersList);
      setDuplicatePhones(dupPhones);
      setDuplicateNames(dupNames);
    } catch (error) {
      console.error('Failed to load customers:', error);
      setLoadError(error instanceof Error ? error.message : 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (identityLoading) return;
    if (identity?.role === 'technician') {
      router.replace('/dashboard/tecnico');
      return;
    }
    loadCustomers();
  }, [identity, identityLoading, router]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = customers.filter(
        (c) =>
          getCustomerDisplayName(c).toLowerCase().includes(term) ||
          c.phone.includes(term) ||
          (c.email && c.email.toLowerCase().includes(term))
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleViewHistory = async (customer: Customer) => {
    setHistoryCustomer(customer);
    setHistoryOpen(true);
  };

  const handleNewOrder = (customer: Customer) => {
    // Guardar en localStorage y redirigir a recepción
    const draft = {
      clienteNombre: getCustomerDisplayName(customer),
      clienteTelefono: customer.phone,
      clienteEmail: customer.email || '',
      equipoTipo: '',
      equipoModelo: '',
      equipoFalla: '',
      fechaPromesa: '',
      costo: 0,
      notasExtra: '',
      checks: { cargador: false, pantalla: false, prende: false, respaldo: false },
      fotoAdjunta: false,
    };
    localStorage.setItem('srf_borrador_orden', JSON.stringify(draft));
    window.location.href = '/dashboard/operativo';
  };

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const getCustomerBadge = (customer: Customer) => {
    const normalizedPhone = customer.phone.replace(/\D/g, '');
    const normalizedName = getCustomerDisplayName(customer).trim().toLowerCase();
    if (duplicatePhones.includes(normalizedPhone)) {
      return <span className="badge-recibido text-xs">Posible duplicado</span>;
    }
    if (duplicateNames.includes(normalizedName)) {
      return <span className="badge-diagnostico text-xs">Nombre repetido</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500/25 border-t-sky-400" />
      </div>
    );
  }

  if (identity?.role === 'technician') {
    return null;
  }

  if (loadError && customers.length === 0) {
    return (
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
        <p className="font-semibold">No se pudieron cargar los clientes</p>
        <p className="mt-2 text-rose-100/80">{loadError}</p>
        <button
          type="button"
          onClick={() => loadCustomers()}
          className="mt-4 rounded-2xl border border-rose-500/20 bg-slate-950/70 px-4 py-2 font-semibold text-rose-100"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-400/70">CRM</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-50">Clientes</h1>
          <p className="mt-1 text-sm text-slate-400">
            {filteredCustomers.length} clientes · {duplicatePhones.length} teléfonos duplicados · {duplicateNames.length} nombres repetidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => loadCustomers()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
          <Button
            onClick={() => {
              setSelectedCustomer(null);
              setModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo cliente
          </Button>
        </div>
      </div>

      {/* Duplicates alert */}
      {(duplicatePhones.length > 0 || duplicateNames.length > 0) && (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          <strong>Atención:</strong> Teléfonos repetidos detectados:{' '}
          {duplicatePhones.map((phone) => formatPhone(phone)).join(', ')}
          {duplicateNames.length > 0 ? ` · Nombres repetidos: ${duplicateNames.join(', ')}` : ''}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Buscar por nombre, teléfono o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Customers table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800 bg-slate-950/70">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">Cliente</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">Contacto</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">Teléfono</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-slate-800/80 transition-colors hover:bg-slate-900/50"
              >
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-slate-100">{getCustomerDisplayName(customer)}</span>
                    {getCustomerBadge(customer)}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {formatPhone(customer.phone)}
                </td>
                <td className="py-3 px-4">
                  <a
                    href={`https://wa.me/52${customer.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                  >
                    <Phone className="w-3 h-3" />
                    WhatsApp
                  </a>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {customer.email || '—'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="rounded p-1 text-sky-300 hover:bg-sky-500/10"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewHistory(customer)}
                      className="rounded p-1 text-sky-300 hover:bg-sky-500/10"
                      title="Historial"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleNewOrder(customer)}
                      className="rounded p-1 text-cyan-300 hover:bg-cyan-500/10"
                      title="Nueva orden"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-400">No hay clientes con esos filtros</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customer={selectedCustomer}
        onCustomerSaved={() => loadCustomers()}
      />

      <CustomerHistory
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        customer={historyCustomer}
      />
    </div>
  );
}
