'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, RefreshCw, Edit2, Package, AlertTriangle, ArrowUpDown, Filter, Layers3, ArrowRightLeft, ShoppingCart, Loader2 } from 'lucide-react';
import { Badge, SurfaceCard } from '@white-label/ui';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductModal } from '@/components/stock/product-modal';
import { MovementModal } from '@/components/stock/movement-modal';
import { TransferModal } from '@/components/stock/transfer-modal';
import type { Product, StockAlert } from '@/types';
import { apiGateway } from '@/services/apiGateway';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Suggestion {
  product_id: string;
  sku: string;
  name: string;
  current_stock: number;
  pending_reservations: number;
  minimum_stock: number;
  suggested_quantity: number;
}

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'suggestions'>('inventory');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [movementProduct, setMovementProduct] = useState<Product | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferProduct, setTransferProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [generatingPo, setGeneratingPo] = useState(false);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.alerta_stock).length;
    const outOfStock = products.filter((p) => Number(p.stock_current ?? 0) <= 0).length;
    const stockValue = products.reduce((sum, product) => sum + (Number(product.stock_current ?? 0) * Number(product.cost ?? 0)), 0);

    return { totalProducts, lowStock, outOfStock, stockValue };
  }, [products]);

  const loadProducts = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await apiClient.get<{ data: Product[] }>('/inventory', getApiOptions());
      const productsList = data.data || [];

      const enrichedProducts = productsList.map((p) => {
        const stock = p.stock_current || 0;
        const minStock = p.minimum_stock || 5;
        let alerta_nivel: 'bajo' | 'critico' | 'agotado' | undefined;
        let alerta_stock = false;

        if (stock <= 0) {
          alerta_nivel = 'agotado';
          alerta_stock = true;
        } else if (stock <= minStock / 2) {
          alerta_nivel = 'critico';
          alerta_stock = true;
        } else if (stock <= minStock) {
          alerta_nivel = 'bajo';
          alerta_stock = true;
        }

        return { ...p, alerta_nivel, alerta_stock };
      });

      setProducts(enrichedProducts);

      const uniqueCategories = Array.from(new Set(productsList.map((p) => p.category).filter(Boolean))) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoadError(error instanceof Error ? error.message : 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const data = await apiClient.get<{ data: StockAlert[] }>('/stock-alerts', getApiOptions());
      setAlerts(data.data || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const loadSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const res = await apiGateway.getProcurementSuggestions();
      setSuggestions(res.data || []);
    } catch (e) {
      toast.error('Error al cargar sugerencias');
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const res = await apiGateway.getSuppliers() as Array<Record<string, unknown>>;
      setSuppliers(res || []);
      if (res.length > 0) setSelectedSupplier(String(res[0].id));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProducts();
    loadAlerts();
    loadSuggestions();
    loadSuppliers();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.sku && p.sku.toLowerCase().includes(term)) ||
          (p.brand && p.brand.toLowerCase().includes(term))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (showAlertsOnly) {
      filtered = filtered.filter((p) => p.alerta_stock);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, showAlertsOnly, products]);

  const handleGeneratePO = async () => {
    if (!selectedSupplier) {
      toast.error('Por favor selecciona un proveedor.');
      return;
    }
    const itemsToOrder = suggestions.filter(s => s.suggested_quantity > 0);
    if (itemsToOrder.length === 0) {
      toast.error('No hay sugerencias para ordenar.');
      return;
    }

    setGeneratingPo(true);
    try {
      const payload = {
        supplierId: selectedSupplier,
        items: itemsToOrder.map(i => ({
          productId: i.product_id,
          quantity: Math.ceil(i.suggested_quantity),
          unitCost: 0 // Will be defined or edited inside order edit flow
        })),
        notes: 'Generado automáticamente basado en sugerencias de stock mínimo y piezas pendientes'
      };

      await apiGateway.createPurchaseOrder(payload);
      toast.success('¡Orden de compra generada como borrador!');
      setPoModalOpen(false);
    } catch (e) {
      toast.error('Error al generar la orden de compra');
    } finally {
      setGeneratingPo(false);
    }
  };

  const getAlertBadge = (product: Product) => {
    if (product.alerta_nivel === 'agotado') {
      return <Badge variant="danger">Agotado</Badge>;
    }
    if (product.alerta_nivel === 'critico') {
      return <Badge variant="warning">Crítico</Badge>;
    }
    if (product.alerta_nivel === 'bajo') {
      return <Badge variant="warning">Stock bajo</Badge>;
    }
    return <Badge variant="success">Activo</Badge>;
  };

  return (
    <div className="space-y-6 bg-slate-50 p-6 min-h-[calc(100vh-64px)] text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventario</h1>
          <p className="mt-1 text-sm text-slate-500">
            {stats.totalProducts} productos · {stats.lowStock} con stock bajo · {stats.outOfStock} agotados
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'inventory' && (
            <Button
              onClick={() => {
                setSelectedProduct(null);
                setProductModalOpen(true);
              }}
              className="gap-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Nuevo producto
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all
            ${activeTab === 'inventory'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Lista de Stock
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all flex items-center gap-2
            ${activeTab === 'suggestions'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Sugerencias de Compra
          {suggestions.filter(s => s.suggested_quantity > 0).length > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {suggestions.filter(s => s.suggested_quantity > 0).length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SurfaceCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500">Productos activos</div>
                <Layers3 className="h-5 w-5 text-sky-500" />
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{stats.totalProducts}</div>
            </SurfaceCard>
            <SurfaceCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500">Stock bajo</div>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="mt-3 text-3xl font-bold text-amber-600">{stats.lowStock}</div>
            </SurfaceCard>
            <SurfaceCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500">Agotados</div>
                <Package className="h-5 w-5 text-rose-500" />
              </div>
              <div className="mt-3 text-3xl font-bold text-rose-600">{stats.outOfStock}</div>
            </SurfaceCard>
            <SurfaceCard className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500">Valor inventario</div>
                <ArrowUpDown className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900">
                ${stats.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </SurfaceCard>
          </div>

          {stats.lowStock > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-center gap-2 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Hay {stats.lowStock} producto(s) con stock bajo o agotado. Revisa las sugerencias de compra.</span>
            </div>
          )}

          {/* Filters */}
          <SurfaceCard className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por SKU, nombre, marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-slate-200 bg-white"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full lg:w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={showAlertsOnly}
                onChange={(e) => setShowAlertsOnly(e.target.checked)}
                className="accent-sky-500 rounded"
              />
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400" /> Solo alertas</span>
            </label>
            <Button
              onClick={() => {
                loadProducts();
                loadAlerts();
              }}
              variant="outline"
              className="gap-2 border-slate-250 hover:bg-slate-50 font-semibold"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              Actualizar
            </Button>
          </SurfaceCard>

          {/* Products table */}
          <SurfaceCard className="overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-xl">
            <table className="w-full text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-slate-600 font-semibold">
                  <th className="text-left py-3.5 px-4">SKU</th>
                  <th className="text-left py-3.5 px-4">Producto</th>
                  <th className="text-left py-3.5 px-4">Categoría</th>
                  <th className="text-left py-3.5 px-4">Marca</th>
                  <th className="text-right py-3.5 px-4">Stock</th>
                  <th className="text-right py-3.5 px-4">Mínimo</th>
                  <th className="text-right py-3.5 px-4">Costo</th>
                  <th className="text-right py-3.5 px-4">Precio</th>
                  <th className="text-left py-3.5 px-4">Estado</th>
                  <th className="text-left py-3.5 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                      product.alerta_stock ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-500">{product.sku}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{product.name}</div>
                      {(product as Product & { proveedor?: string }).proveedor && (
                        <div className="text-xs text-slate-400">{(product as Product & { proveedor?: string }).proveedor}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{product.category || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{product.brand || '—'}</td>
                    <td className={`py-3 px-4 text-right font-bold ${product.alerta_stock ? 'text-amber-600' : 'text-slate-900'}`}>
                      {product.stock_current || 0}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">{product.minimum_stock || 0}</td>
                    <td className="py-3 px-4 text-right text-slate-600">${(product.cost || 0).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-semibold">${(product.sale_price || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">{getAlertBadge(product)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setProductModalOpen(true);
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-sky-600"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setMovementProduct(product);
                            setMovementModalOpen(true);
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-cyan-600"
                          title="Ver Kardex"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTransferProduct(product);
                            setTransferModalOpen(true);
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-violet-600"
                          title="Transferir"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <Package className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-semibold text-slate-500">No hay productos con esos filtros</p>
              </div>
            )}
          </SurfaceCard>
        </>
      ) : (
        <>
          {/* Suggestions Tab */}
          <div className="flex justify-between items-center bg-white border border-slate-200 shadow-sm p-4 rounded-xl">
            <p className="text-sm text-slate-500">
              Las sugerencias se calculan a partir del stock mínimo requerido y las reservas solicitadas por los técnicos para las reparaciones activas.
            </p>
            <Button
              onClick={() => setPoModalOpen(true)}
              disabled={suggestions.filter(s => s.suggested_quantity > 0).length === 0}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Generar Orden de Compra
            </Button>
          </div>

          <SurfaceCard className="overflow-hidden p-0 bg-white border border-slate-200 shadow-sm rounded-xl">
            {suggestionsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
            ) : (
              <table className="w-full text-sm text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-slate-600 font-semibold">
                    <th className="text-left py-3.5 px-4">SKU</th>
                    <th className="text-left py-3.5 px-4">Producto</th>
                    <th className="text-right py-3.5 px-4">Stock Actual</th>
                    <th className="text-right py-3.5 px-4">Reservas Activas</th>
                    <th className="text-right py-3.5 px-4">Stock Mínimo</th>
                    <th className="text-right py-3.5 px-4">Sugerencia de Pedido</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map(s => (
                    <tr key={s.product_id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-500">{s.sku}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4 text-right font-medium">{s.current_stock}</td>
                      <td className="py-3 px-4 text-right text-sky-600 font-semibold">{s.pending_reservations}</td>
                      <td className="py-3 px-4 text-right text-slate-500">{s.minimum_stock}</td>
                      <td className={`py-3 px-4 text-right font-bold ${s.suggested_quantity > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {s.suggested_quantity > 0 ? Math.ceil(s.suggested_quantity) : 'Suficiente'}
                      </td>
                    </tr>
                  ))}
                  {suggestions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        El stock está totalmente al día, no hay sugerencias de abastecimiento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </SurfaceCard>
        </>
      )}

      {/* Modals */}
      <ProductModal
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        product={selectedProduct}
        onProductSaved={() => {
          loadProducts();
          loadAlerts();
        }}
      />

      <MovementModal
        open={movementModalOpen}
        onOpenChange={setMovementModalOpen}
        product={movementProduct}
        onMovementSaved={() => {
          loadProducts();
          loadAlerts();
        }}
      />

      <TransferModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        product={transferProduct}
        onTransferSuccess={() => {
          loadProducts();
          loadAlerts();
        }}
      />

      {/* PO Generator Modal */}
      <Dialog open={poModalOpen} onOpenChange={setPoModalOpen}>
        <DialogContent className="bg-white p-6 max-w-md border border-slate-200 shadow-lg rounded-xl">
          <DialogTitle className="text-xl font-bold text-slate-900">Generar Orden de Compra</DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            Selecciona el proveedor con el que surtirás esta orden. Se incluirán automáticamente todos los productos con sugerencia de pedido.
          </DialogDescription>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Proveedor</label>
              <select
                value={selectedSupplier}
                onChange={e => setSelectedSupplier(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
              >
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleGeneratePO}
              disabled={generatingPo || suppliers.length === 0}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2.5 font-semibold"
            >
              {generatingPo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Generar Orden como Borrador'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
