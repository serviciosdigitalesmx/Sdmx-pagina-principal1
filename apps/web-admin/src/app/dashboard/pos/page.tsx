'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { SurfaceCard } from '@white-label/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import { getCurrentSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('Venta Mostrador');
  const router = useRouter();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      // Fetch real inventory, map to Product structure
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

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setCheckoutLoading(true);
    try {
      const session = getCurrentSession();
      // Creamos una orden de servicio "falsa" tipo venta directa
      const notes = cart.map(i => `${i.quantity}x ${i.description}`).join(', ');
      
      const payload = {
        clientName: customerName,
        clientPhone: customerPhone || '0000000000',
        deviceType: 'Venta',
        deviceModel: 'Directa',
        serialNumber: '',
        issue: 'Venta de accesorios/refacciones en mostrador',
        estimatedCost: total,
        sucursalId: session?.branchId || undefined,
        checklist: {
          notes: `Venta Mostrador:\n${notes}`
        }
      };
      const result = (await apiGateway.createOrder(payload)) as any;
      // Creamos el pago (ingreso) automático
      if (total > 0 && result.id) {
        await apiGateway.createOrderPayment(result.id, {
          amount: total,
          paymentMethod: 'cash',
          notes: 'Venta de mostrador POS',
        });
      }  
        // Aquí idealmente consumiríamos el inventario usando createInventoryReservation + consume
        // pero por simplicidad de la prueba de concepto, con la nota en la orden basta por ahora.
      
      toast.success('¡Venta registrada con éxito!');
      setCart([]);
      setCustomerPhone('');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Error al procesar la venta');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.description.toLowerCase().includes(query.toLowerCase()) || 
    p.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col lg:flex-row gap-6">
      {/* Columna Izquierda: Catálogo */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
          <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-400" />
            Punto de Venta (Accesorios)
          </h2>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Buscar producto por SKU o nombre..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-9 bg-slate-950 border-slate-800 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No se encontraron productos.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map(p => (
                <div 
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer select-none
                    ${p.stock > 0 
                      ? 'border-slate-800 bg-slate-900 hover:border-sky-500/50 hover:bg-slate-800' 
                      : 'border-slate-800/50 bg-slate-900/30 opacity-60 cursor-not-allowed'}`}
                >
                  <p className="text-xs text-slate-500 font-mono mb-1">{p.sku}</p>
                  <p className="text-sm font-semibold text-slate-200 line-clamp-2 leading-tight h-10">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-emerald-400 font-bold">${p.unitPrice.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">Stock: {p.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Carrito */}
      <div className="w-full lg:w-[400px] flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shrink-0">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-50">Resumen de Venta</h3>
          <span className="text-xs font-semibold bg-sky-500/10 text-sky-400 px-2 py-1 rounded-full">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">El carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex flex-col gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-medium text-slate-200 leading-tight">{item.description}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-emerald-400 font-semibold text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                  <div className="flex items-center gap-2 bg-slate-950 rounded-md border border-slate-800 p-0.5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="mb-4 space-y-3">
            <Input 
              placeholder="Teléfono del cliente (opcional)"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              className="bg-slate-950 border-slate-800 h-9 text-sm"
            />
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Total a cobrar:</span>
            <span className="text-2xl font-black text-emerald-400">${total.toFixed(2)}</span>
          </div>
          
          <Button 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || checkoutLoading}
            className="w-full h-12 text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
          >
            {checkoutLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
            {checkoutLoading ? 'Procesando...' : 'Cobrar Efectivo'}
          </Button>
        </div>
      </div>
    </div>
  );
}
