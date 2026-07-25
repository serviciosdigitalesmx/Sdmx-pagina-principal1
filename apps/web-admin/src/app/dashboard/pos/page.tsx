'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, Loader2, Wallet, LogOut, Receipt, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import { ShiftModal } from '@/components/pos/shift-modal';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type Product = {
  id: string;
  sku: string;
  description: string;
  unitPrice: number;
  stock: number;
};

type CartItem = Product & { quantity: number };

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Shift state
  const [activeShift, setActiveShift] = useState<any>(null);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [shiftModalMode, setShiftModalMode] = useState<'open' | 'close'>('open');

  // Checkout state
  const [customerName, setCustomerName] = useState('Venta Mostrador');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Receipt Modal
  const [receiptSale, setReceiptSale] = useState<any>(null);

  useEffect(() => {
    checkShift();
    loadInventory();
  }, []);

  const checkShift = async () => {
    try {
      const shift = await apiGateway.getActiveCashShift();
      setActiveShift(shift);
    } catch (e) {
      console.error(e);
    }
  };

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ data: { items: any[] } }>('/inventory', getApiOptions());
      const mapped = (response.data?.items || []).map(p => ({
        id: p.id,
        sku: p.sku || 'N/A',
        description: p.description || 'Producto sin nombre',
        unitPrice: Number(p.salePrice || p.sale_price || 0),
        stock: Number(p.inventoryCount || p.inventory_count || 0),
      }));
      setProducts(mapped);
    } catch (err) {
      console.error('Failed to load inventory', err);
      toast.error('No se pudo cargar el inventario.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Producto sin stock');
      return;
    }
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        if (exists.quantity >= product.stock) {
          toast.error('Stock máximo alcanzado');
          return prev;
        }
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        if (newQ > item.stock) {
          toast.error('Stock insuficiente');
          return item;
        }
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const change = Number(amountPaid) > total ? Number(amountPaid) - total : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'cash' && Number(amountPaid) < total) {
      toast.error('Monto pagado es menor al total.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        customerName,
        customerPhone: customerPhone || undefined,
        paymentMethod,
        items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
        notes: `Venta POS en caja: ${activeShift?.cash_registers?.name || 'Caja'}`
      };

      const result = await apiGateway.createSale(payload);
      toast.success('¡Venta realizada con éxito!');
      setReceiptSale({ ...result, items: [...cart], total });
      setCart([]);
      setAmountPaid('');
      loadInventory(); // Refresh stock
    } catch (err: any) {
      toast.error(err?.message || 'Error al procesar la venta');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!activeShift) {
    return (
      <div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto rounded-full bg-amber-50 p-4 w-16 h-16 flex items-center justify-center mb-6">
            <Wallet className="h-8 w-8 text-amber-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Caja Cerrada</h2>
          <p className="text-slate-500 mt-2">
            Debes abrir un turno de caja para poder operar el Punto de Venta (POS) y registrar transacciones financieras.
          </p>
          <Button
            onClick={() => {
              setShiftModalMode('open');
              setShiftModalOpen(true);
            }}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white mt-6 py-2.5 rounded-xl font-semibold"
          >
            Abrir Caja Registradora
          </Button>
        </div>
        <ShiftModal
          open={shiftModalOpen}
          onOpenChange={setShiftModalOpen}
          mode={shiftModalMode}
          onSuccess={checkShift}
        />
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col bg-slate-50 overflow-hidden">
      {/* Barra de Turno */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 rounded-full p-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-950">
              {activeShift.cash_registers?.name || 'Caja Principal'}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Fondo Inicial: <strong>${activeShift.initial_cash}</strong></span>
              <span>•</span>
              <span>Abierto el {new Date(activeShift.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setShiftModalMode('close');
            setShiftModalOpen(true);
          }}
          className="border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Turno / Arqueo
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6 min-h-0">
        {/* Panel 1: Catálogo */}
        <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm min-h-0">
          <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o SKU..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-9 h-10 border-slate-200 bg-slate-50/50 text-slate-950 text-sm focus:bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm font-medium">No se encontraron productos.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none bg-white shadow-sm
                      ${p.stock > 0
                        ? 'border-slate-200 hover:border-sky-500 hover:shadow-md'
                        : 'border-slate-200/50 opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">{p.sku}</span>
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug h-10">{p.description}</h4>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-emerald-600 font-bold text-base">${p.unitPrice.toFixed(2)}</span>
                      <span className="text-xs text-slate-500">Stock: {p.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Carrito */}
        <div className="w-full lg:w-[380px] flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm shrink-0 min-h-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-sky-500" />
              Detalle de Venta
            </h3>
            <span className="bg-sky-50 text-sky-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} arts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 py-20">
                <ShoppingCart className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-slate-400 text-sm font-medium">El carrito está vacío</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-150 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.description}</p>
                    <p className="text-xs text-slate-500 mt-1">${item.unitPrice.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    <div className="flex items-center gap-2 mt-2 bg-slate-100 p-1 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded hover:bg-white text-slate-600"><Minus className="h-3 w-3" /></button>
                      <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded hover:bg-white text-slate-600"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 p-4 bg-white space-y-4 shrink-0">
            <div className="flex justify-between items-center text-slate-900">
              <span className="text-sm font-medium text-slate-500">Total a Pagar</span>
              <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {(['cash', 'card', 'transfer'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all
                      ${paymentMethod === method
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    <DollarSign className="h-4 w-4" />
                    {method === 'cash' ? 'Efectivo' : method === 'card' ? 'Tarjeta' : 'Transf.'}
                  </button>
                ))}
              </div>

              {paymentMethod === 'cash' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Monto Recibido</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <Input
                      type="number"
                      value={amountPaid}
                      onChange={e => setAmountPaid(e.target.value)}
                      placeholder="0.00"
                      className="pl-7 border-slate-200 bg-white rounded-lg text-slate-900"
                    />
                  </div>
                  {Number(amountPaid) > total && (
                    <div className="flex justify-between items-center text-xs font-semibold text-emerald-600 mt-2 bg-emerald-50/50 p-2 rounded-lg">
                      <span>Cambio</span>
                      <span>${change.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={checkoutLoading || cart.length === 0}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3 font-bold mt-2"
              >
                {checkoutLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
                Completar Cobro
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ShiftModal
        open={shiftModalOpen}
        onOpenChange={setShiftModalOpen}
        mode={shiftModalMode}
        onSuccess={checkShift}
      />

      {/* Ticket Dialog */}
      <Dialog open={!!receiptSale} onOpenChange={(open) => { if (!open) setReceiptSale(null); }}>
        <DialogContent className="bg-white max-w-sm p-6 rounded-xl border border-slate-200 shadow-lg text-slate-900 font-mono">
          <div className="text-center border-b border-dashed border-slate-300 pb-4">
            <DialogTitle className="text-lg font-bold">FIXI TICKET</DialogTitle>
            <DialogDescription className="text-[11px] text-slate-500 mt-1 font-sans">
              Comprobante de Venta de Mostrador
            </DialogDescription>
          </div>

          {receiptSale && (
            <div className="space-y-4 py-4 text-xs">
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{new Date(receiptSale.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span>{receiptSale.customer_name}</span>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-3 my-2 space-y-2">
                {receiptSale.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>{item.quantity}x {item.description}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL:</span>
                <span>${receiptSale.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Pago:</span>
                <span>{receiptSale.payment_method === 'cash' ? 'Efectivo' : 'Electrónico'}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-dashed border-slate-300 pt-4 font-sans">
            <Button variant="ghost" onClick={() => setReceiptSale(null)}>Cerrar</Button>
            <Button onClick={() => window.print()} className="bg-sky-500 hover:bg-sky-600 text-white"><Receipt className="h-4 w-4 mr-2" /> Imprimir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
