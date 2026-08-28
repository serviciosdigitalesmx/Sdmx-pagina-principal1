'use client';

import { useState, useMemo } from 'react';
import { Search, RefreshCw, Filter, Grid2X2, List, Clock3, MessageSquare, Eye, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types';
import { OrderCard } from '@/components/tecnico/order-card';
import { OrderModal } from '@/components/tecnico/order-modal';
import { LoadingState, ErrorState } from '@/components/base/states';
import { EmptyState, MoneyCard } from '@/components/base/cards';
import { StatusBadge } from '@/components/base/badges';
import { SurfaceCard } from '@white-label/ui';
import { Button } from '@/components/ui/button';
import { getOrderLabel } from '@/lib/labels';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { apiGateway } from '@/services/apiGateway';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

type ViewMode = 'kanban' | 'list';

const STATUS_ORDER = [
  'recibido',
  'diagnostico',
  'cotizado',
  'en_espera_de_refaccion',
  'reparacion',
  'listo_para_entrega',
  'listo',
  'entregado',
  'cancelado',
];

const STATUS_LABELS: Record<string, string> = {
  recibido: 'Recibido',
  diagnostico: 'Diagnóstico',
  cotizado: 'Cotizado',
  en_espera_de_refaccion: 'En espera de refacción',
  reparacion: 'Reparación',
  listo_para_entrega: 'Listo para entrega',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const STATUS_TONES: Record<string, 'primary' | 'warning' | 'success' | 'danger' | 'neutral'> = {
  recibido: 'primary',
  diagnostico: 'warning',
  cotizado: 'warning',
  en_espera_de_refaccion: 'warning',
  reparacion: 'primary',
  listo_para_entrega: 'success',
  listo: 'success',
  entregado: 'neutral',
  cancelado: 'danger',
};

function normalizeOrderStatus(status: string) {
  return String(status || '').toLowerCase().trim();
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Number(value ?? 0) || 0);
}

export default function OrdersPage() {
  const router = useRouter();
  const orderLabel = getOrderLabel();
  const ordersLabel = getOrderLabel({ plural: true });
  
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Activate Realtime sync
  useSupabaseRealtime();

  // Load orders using TanStack useQuery
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['orders', debouncedSearch, statusFilter, page],
    queryFn: () => apiGateway.getOrders({
      search: debouncedSearch,
      status: statusFilter,
      page,
      limit: 50
    }),
  });

  const orders = useMemo(() => (data?.data ?? []) as unknown as Order[], [data?.data]);

  const groupedOrders = useMemo(() => {
    const groups = new Map<string, Order[]>();
    for (const order of orders) {
      const status = normalizeOrderStatus(order.status) || 'recibido';
      if (!groups.has(status)) groups.set(status, []);
      groups.get(status)?.push(order);
    }
    return groups;
  }, [orders]);

  const orderedStatusKeys = useMemo(() => {
    const present = new Set(orders.map((order) => normalizeOrderStatus(order.status) || 'recibido'));
    return [
      ...STATUS_ORDER.filter((status) => present.has(status)),
      ...Array.from(present).filter((status) => !STATUS_ORDER.includes(status)),
    ];
  }, [orders]);

  const totalBalance = useMemo(() => orders.reduce((sum, order) => sum + Number(order.final_cost || order.estimated_cost || 0), 0), [orders]);
  const activeCount = useMemo(
    () => orders.filter((order) => !['entregado', 'cancelado'].includes(normalizeOrderStatus(order.status))).length,
    [orders],
  );

  function openDetail(order: Order) {
    setSelectedOrder(order);
    setDetailOpen(true);
  }

  if (isLoading) {
    return <LoadingState label="Cargando órdenes reales..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Error al cargar las órdenes'}
        action={
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6 bg-slate-50 p-6 min-h-[calc(100vh-64px)] text-slate-900">
      <div className="grid gap-4 lg:grid-cols-4">
        <MoneyCard label={`${ordersLabel} activas`} value={String(activeCount)} helper="No entregadas o canceladas" />
        <MoneyCard label={`${ordersLabel} visibles`} value={String(orders.length)} helper="Filtradas en la vista actual" />
        <MoneyCard label="Estados activos" value={String(orderedStatusKeys.length)} helper="Estados reales detectados" />
        <MoneyCard label="Valor estimado" value={formatMoney(totalBalance)} helper="Suma de coste estimado/final" accent />
      </div>

      <SurfaceCard className="space-y-4 p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{ordersLabel}</h1>
            <p className="mt-1 text-sm text-slate-500">Lista, búsqueda, kanban y detalle en tiempo real con WebSockets.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => refetch()} className="gap-2 border-slate-200">
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button variant="outline" onClick={() => setViewMode((current) => (current === 'kanban' ? 'list' : 'kanban'))} className="gap-2 border-slate-200">
              {viewMode === 'kanban' ? <List className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
              {viewMode === 'kanban' ? 'Ver lista' : 'Ver kanban'}
            </Button>
            <Button onClick={() => window.dispatchEvent(new CustomEvent('open-quick-receive'))} className="gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl">
              <Plus className="h-4 w-4" />
              Nueva {orderLabel.toLowerCase()}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_260px_200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Búsqueda profunda (Folio, Falla, Serie)..."
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm focus:outline-none text-slate-900"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-sm focus:outline-none text-slate-900"
            >
              <option value="all">Todos los estados</option>
              {STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status] ?? status}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-xs text-sky-800">
            <div className="flex items-center gap-2 font-semibold">
              <Clock3 className="h-4 w-4 text-sky-600" />
              Tiempo Real Activo
            </div>
            <div className="mt-1">Las actualizaciones se sincronizan automáticamente sin refrescar la pantalla.</div>
          </div>
        </div>
      </SurfaceCard>

      {orders.length === 0 ? (
        <EmptyState
          title="No hay órdenes para mostrar"
          description="No encontramos órdenes con los filtros actuales."
          action={
            <Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('all'); }} className="gap-2">
              Limpiar filtros
            </Button>
          }
        />
      ) : null}

      {viewMode === 'kanban' ? (
        <div className="space-y-4">
          {orderedStatusKeys.map((status) => {
            const items = groupedOrders.get(status) ?? [];
            if (items.length === 0) return null;
            return (
              <SurfaceCard key={status} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={STATUS_TONES[status] ?? 'neutral'}>{STATUS_LABELS[status] ?? status}</StatusBadge>
                    <span className="text-xs text-slate-400">{items.length} órdenes</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                  {items.map((order) => (
                    <div key={order.id} className="relative">
                      <OrderCard order={order} onClick={() => openDetail(order)} />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => openDetail(order)} className="gap-2">
                          <Eye className="h-4 w-4" />
                          Detalle
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/operativo?order=${encodeURIComponent(order.id)}`)}
                          className="gap-2 text-slate-500 hover:text-slate-900"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Operativo
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="space-y-2">
              <OrderCard order={order} onClick={() => openDetail(order)} />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => openDetail(order)} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Abrir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/dashboard/operativo?order=${encodeURIComponent(order.id)}`)}
                  className="gap-2 text-slate-500 hover:text-slate-900"
                >
                  <MessageSquare className="h-4 w-4" />
                  Operativo
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center text-sm text-slate-500 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <span>Mostrando {orders.length} resultados (Pág. {page})</span>
        <div className="flex gap-2">
          <Button disabled={page === 1} onClick={() => setPage(p => p - 1)} variant="outline" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Anterior
          </Button>
          <Button disabled={orders.length < 50} onClick={() => setPage(p => p + 1)} variant="outline" className="flex items-center gap-1">
            Siguiente <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedOrder ? (
        <OrderModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          order={selectedOrder}
          onOrderUpdated={() => void refetch()}
        />
      ) : null}
    </div>
  );
}
