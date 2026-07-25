'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, Loader2, Wallet, LogOut, Receipt, Barcode, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Estado de Caja
  const [activeShift, setActiveShift] = useState<any>(null);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [shiftModalMode, setShiftModalMode] = useState<'open' | 'close'>('open');

  // Estado de Cobro
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Venta Mostrador');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Ticket
  const [receiptSale, setReceiptSale] = useState<any>(null);

  // Buffer para lector de código de barras
  const barcodeBuffer = useRef<string>('');
  const barcodeTimeout = useRef<NodeJS.Timeout | null>(null);

  const checkShift = useCallback(async () => {
    try {
      const shift = await apiGateway.getActiveCashShift();
      setActiveShift(shift);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGateway.getInventory();
      const mapped = response.map((p: any) => ({
        id: p.id,
        sku: p.sku || 'N/A',
        description: p.description || p.name || 'Producto sin nombre',
        unitPrice: Number(p.sale_price || 0),
        stock: Number(p.stock_current || 0),
      }));
      setProducts(mapped);
    } catch (err) {
      toast.error('No se pudo cargar el inventario.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkShift();
    void loadInventory();
  }, [checkShift, loadInventory]);

  // Lógica del Escáner de Código de Barras y Atajos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo F9 para cobrar
      if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0 && activeShift) {
          setCheckoutModalOpen(true);
        } else if (!activeShift) {
          toast.error('Abre turno de caja primero.');
        } else {
          toast.error('El carrito está vacío.');
        }
        return;
      }

      // Evitar interceptar si el usuario está escribiendo en un input formal (ej. nombre del cliente)
      // a menos que sea el buscador principal
      if (document.activeElement?.tagName === 'INPUT' && document.activeElement !== searchInputRef.current) {
        return;
      }

      // Lógica de Pistola Láser
      if (e.key === 'Enter' && barcodeBuffer.current.length > 2) {
        e.preventDefault();
        const scannedSku = barcodeBuffer.current.toLowerCase();
        const foundProduct = products.find(p => p.sku.toLowerCase() === scannedSku);
        
        if (foundProduct) {
          addToCart(foundProduct);
          toast.success(`Agregado: ${foundProduct.description}`);
        } else {
          toast.error(`SKU no encontrado: ${scannedSku}`);
        }
        
        barcodeBuffer.current = '';
        setQuery(''); // Limpiar buscador
        return;
      }

      // Acumular caracteres rápidos (lectura de escáner)
      if (e.key.length === 1) {
        barcodeBuffer.current += e.key;
        if (barcodeTimeout.current) clearTimeout(barcodeTimeout.current);
        
        // Si el usuario deja de escribir por 50ms, no es un escáner, se limpia el buffer
        barcodeTimeout.current = setTimeout(() => {
          barcodeBuffer.current = '';
        }, 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, cart, activeShift]);

  // Mantener el foco en el buscador para captura fluida
  useEffect(() => {
    if (!checkoutModalOpen && !shiftModalOpen && !receiptSale && activeShift) {
      searchInputRef.current?.focus();
    }
  }, [checkoutModalOpen, shiftModalOpen, receiptSale, activeShift]);

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
      toast.error('El monto pagado es menor al total.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        customerName: customerName.trim() || 'Venta Mostrador',
        paymentMethod,
        items: cart.map(i => ({ productId: i.id, quantity: i.quantity })),
        notes: `Venta directa POS`
      };

      // Arquitectura Real: Cero fake service orders. Consumimos el endpoint transaccional de ventas.
      const result = await apiGateway.createSale(payload);
      
      setReceiptSale({ ...result, items: [...cart], total, paymentMethod });
      setCart([]);
      setAmountPaid('');
      setCustomerName('Venta Mostrador');
      setCheckoutModalOpen(false);
      void loadInventory(); // Refrescar stock visualmente
    } catch (err: any) {
      toast.error(err?.message || 'Error al procesar la venta');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!activeShift) {
    return (
      <div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.07)]">
          <div className="mx-auto rounded-full bg-amber-50 p-5 w-20 h-20 flex items-center justify-center mb-6">
            <Wallet className="h-10 w-10 text-amber-600 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Caja Cerrada</h2>
          <p className="text-slate-500 mt-3 leading-relaxed">
            Para mantener el control financiero al centavo, debes abrir un turno ingresando el fondo de caja inicial.
          </p>
          <Button
            onClick={() => {
              setShiftModalMode('open');
              setShiftModalOpen(true);
            }}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white mt-8 h-14 rounded-xl text-lg font-bold shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
          >
            Abrir Turno de Caja
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
    <div className="flex h-[calc(100vh-140px)] flex-col bg-slate-50 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      {/* BARRA SUPERIOR (HEADER DEL POS) */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TerminalSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {activeShift.cash_registers?.name || 'Punto de Venta'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Fondo: ${activeShift.initial_cash}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShiftModalMode('close');
              setShiftModalOpen(true);
            }}
            className="border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors h-10 font-bold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Corte Z
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-slate-100">
        
        {/* COLUMNA IZQUIERDA: CATÁLOGO Y BÚSQUEDA */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 shrink-0">
            <div className="relative">
              <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-500" />
              <Input
                ref={searchInputRef}
                placeholder="Escanea el código de barras o busca el producto..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-12 h-14 bg-white border-none shadow-sm text-lg font-medium focus-visible:ring-2 focus-visible:ring-sky-500"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded bg-slate-50">AUTO-FOCUS</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-medium">No se encontraron productos.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none bg-white shadow-sm flex flex-col justify-between h-36
                      ${p.stock > 0
                        ? 'border-slate-200 hover:border-sky-500 hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                        : 'border-rose-100 bg-rose-50/30 opacity-60 cursor-not-allowed'}`}
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">{p.sku}</span>
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">{p.description}</h4>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-lg font-black text-sky-600">${p.unitPrice.toFixed(2)}</span>
                      <span className={`text-xs font-bold ${p.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {p.stock} uds
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: TICKET / CARRITO */}
        <div className="w-full lg:w-[420px] flex flex-col bg-white border-l border-slate-200 shrink-0 min-h-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-slate-400" />
              Ticket Actual
            </h3>
            <span className="bg-sky-100 text-sky-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Escanea un producto para comenzar</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex flex-col gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{item.description}</p>
                    <p className="text-sm font-black text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-slate-400 font-medium">${item.unitPrice.toFixed(2)} c/u</p>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded bg-white shadow-sm text-slate-600 hover:text-rose-500 hover:bg-rose-50"><Minus className="h-3 w-3" /></button>
                      <span className="text-xs font-black text-slate-800 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded bg-white shadow-sm text-slate-600 hover:text-emerald-500 hover:bg-emerald-50"><Plus className="h-3 w-3" /></button>
                      <div className="w-px h-4 bg-slate-200 mx-1" />
                      <button onClick={() => removeFromCart(item.id)} className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CHECKOUT FOOTER */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 shrink-0 space-y-4">
            <div className="flex justify-between items-end text-slate-900">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total</span>
              <span className="text-4xl font-black text-slate-900 tracking-tight">${total.toFixed(2)}</span>
            </div>
            
            <Button 
              onClick={() => setCheckoutModalOpen(true)} 
              disabled={cart.length === 0}
              className="w-full h-14 text-lg bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 font-bold flex items-center justify-between px-6"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Cobrar
              </div>
              <div className="text-[10px] bg-sky-600/50 px-2 py-1 rounded border border-sky-400/50">F9</div>
            </Button>
          </div>
        </div>
      </div>

      {/* --- MODALES --- */}
      
      {/* Modal de Apertura/Cierre */}
      <ShiftModal
        open={shiftModalOpen}
        onOpenChange={setShiftModalOpen}
        mode={shiftModalMode}
        onSuccess={checkShift}
      />

      {/* Modal de Cobro y Split Payment */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="bg-slate-50 max-w-md p-0 overflow-hidden border-slate-200 shadow-2xl">
          <div className="bg-white p-6 border-b border-slate-200">
            <DialogTitle className="text-2xl font-black text-slate-900">Liquidar Venta</DialogTitle>
            <DialogDescription className="text-slate-500 mt-1 font-medium">Selecciona el método e ingresa el cobro.</DialogDescription>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">A Pagar</span>
              <div className="text-5xl font-black text-slate-900 mt-1">${total.toFixed(2)}</div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cliente (Opcional)</label>
              <Input 
                placeholder="Nombre para el ticket..."
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="bg-white border-slate-200 h-12 text-base focus-visible:ring-sky-500 font-medium"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Método de Pago</label>
              <div className="grid grid-cols-3 gap-3">
                {(['cash', 'card', 'transfer'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => {
                      setPaymentMethod(method);
                      if (method !== 'cash') setAmountPaid(String(total));
                    }}
                    className={`py-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all
                      ${paymentMethod === method
                        ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm ring-2 ring-sky-500/20'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Wallet className="h-5 w-5" />
                    {method === 'cash' ? 'Efectivo' : method === 'card' ? 'Tarjeta' : 'Transf.'}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Efectivo Recibido</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">$</span>
                  <Input
                    type="number"
                    autoFocus
                    value={amountPaid}
                    onChange={e => setAmountPaid(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 h-14 border-slate-300 bg-white rounded-xl text-2xl font-black text-slate-900 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                  />
                </div>
                {Number(amountPaid) > total && (
                  <div className="flex justify-between items-center text-sm font-bold text-emerald-700 mt-2 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <span className="uppercase tracking-wider">Cambio a entregar</span>
                    <span className="text-2xl">${change.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-200">
            <Button 
              onClick={handleCheckout} 
              disabled={checkoutLoading || (paymentMethod === 'cash' && Number(amountPaid) < total)}
              className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 font-black"
            >
              {checkoutLoading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <Receipt className="h-6 w-6 mr-2" />}
              Confirmar Venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Dialog (Para impresión térmica) */}
      <Dialog open={!!receiptSale} onOpenChange={(open) => { if (!open) setReceiptSale(null); }}>
        <DialogContent className="bg-white max-w-xs p-8 rounded-xl border border-slate-200 shadow-2xl text-slate-900 font-mono">
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
            <h2 className="text-xl font-black tracking-widest">TICKET VENTA</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase">Comprobante de Mostrador</p>
          </div>

          {receiptSale && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Fecha:</span>
                <span>{new Date(receiptSale.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Folio:</span>
                <span className="font-bold">{receiptSale.id.split('-')[0].toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Cliente:</span>
                <span>{receiptSale.customer_name}</span>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-3 my-4 space-y-2">
                {receiptSale.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate pr-2">{item.quantity}x {item.description}</span>
                    <span className="font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-base">
                <span className="font-black">TOTAL:</span>
                <span className="font-black">${receiptSale.total?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-slate-500">Método:</span>
                <span className="uppercase font-bold">{receiptSale.payment_method === 'cash' ? 'Efectivo' : 'Tarjeta/Transferencia'}</span>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-300">
            <Button onClick={() => window.print()} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl">
              <Receipt className="h-5 w-5 mr-2" /> Imprimir Ticket
            </Button>
            <Button variant="ghost" onClick={() => setReceiptSale(null)} className="w-full mt-2 font-bold text-slate-500 hover:text-slate-900">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
