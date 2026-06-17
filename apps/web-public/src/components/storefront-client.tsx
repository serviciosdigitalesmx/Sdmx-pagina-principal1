"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fetchJson } from "@white-label/config";
import { RootAuthHashRedirect } from "@/components/root-auth-hash-redirect";
import { getPublicApiPath } from "@/lib/public-api";
import { resolveAdminUrl } from "@/lib/admin-url";

type CatalogItem = {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  brand: string | null;
  sale_price: number;
  cost: number;
  minimum_stock: number;
  unit: string | null;
  location: string | null;
  notes: string | null;
  is_active: boolean;
  stock_current: number;
  in_stock: boolean;
  inventory_state: "agotado" | "bajo" | "disponible";
};

type StoreCheckoutResponse = {
  success: true;
  data: {
    order: { folio: string; id: string; public_token: string; status: string; final_cost: number };
    items: Array<{ productId: string; sku: string; name: string; quantity: number; unitPrice: number; subtotal: number }>;
    shipping: number;
    subtotal: number;
    total: number;
  };
};

function money(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(value);
}

export function StorefrontClient({
  brandName,
  brandShort,
  defaultTenantSlug,
  initialTenantSlug,
  initialCatalog,
}: {
  brandName: string;
  brandShort: string;
  defaultTenantSlug: string;
  initialTenantSlug: string;
  initialCatalog: CatalogItem[];
}) {
  const [tenantSlugInput, setTenantSlugInput] = useState(initialTenantSlug || defaultTenantSlug);
  const [tenantSlug, setTenantSlug] = useState(initialTenantSlug || defaultTenantSlug);
  const [catalog, setCatalog] = useState<CatalogItem[]>(initialCatalog);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<StoreCheckoutResponse["data"] | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});

  const categories = useMemo(() => ["all", ...Array.from(new Set(catalog.map((item) => item.category).filter(Boolean) as string[]))], [catalog]);

  const filteredCatalog = useMemo(() => {
    const query = search.trim().toLowerCase();
    return catalog.filter((item) => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const haystack = `${item.sku} ${item.name} ${item.brand ?? ""} ${item.category ?? ""}`.toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [catalog, categoryFilter, search]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = catalog.find((item) => item.id === productId);
        if (!product) return null;
        return { product, quantity };
      })
      .filter(Boolean) as Array<{ product: CatalogItem; quantity: number }>;
  }, [catalog, cart]);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity * Number(item.product.sale_price ?? 0), 0), [cartItems]);
  const shipping = subtotal >= 1200 ? 0 : 149;
  const total = subtotal + shipping;

  const setQuantity = (productId: string, quantity: number) => {
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[productId];
        return next;
      }
      next[productId] = quantity;
      return next;
    });
  };

  const loadTenant = async () => {
    if (!tenantSlugInput.trim()) {
      setError("Ingresa el tenant de la tienda");
      return;
    }
    setTenantSlug(tenantSlugInput.trim());
    setLoading(true);
    setError(null);
    setCheckoutSuccess(null);
    try {
      const payload = await fetchJson<{ data: { catalog: CatalogItem[] } }>(getPublicApiPath(`/api/public/store/${encodeURIComponent(tenantSlugInput.trim())}/catalog`));
      setCatalog(payload.data.catalog);
    } catch (catalogError) {
      setCatalog([]);
      setError(catalogError instanceof Error ? catalogError.message : "No se pudo cargar el catálogo");
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      if (!tenantSlug.trim()) throw new Error("Ingresa el tenant de la tienda");
      if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
        throw new Error("Completa tus datos de entrega antes de pagar");
      }
      if (cartItems.length === 0) throw new Error("Agrega productos al carrito");

      const payload = await fetchJson<StoreCheckoutResponse>(getPublicApiPath("/api/public/store/checkout"), {
        method: "POST",
        body: JSON.stringify({
          tenantSlug,
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          city,
          state,
          postalCode,
          notes,
          items: cartItems.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        }),
      });

      setCheckoutSuccess(payload.data);
      setCart({});
    } catch (checkoutFailure) {
      setCheckoutError(checkoutFailure instanceof Error ? checkoutFailure.message : "No se pudo crear el pedido");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const landingTitle = tenantSlug ? `Tienda de ${tenantSlug}` : "Tu tienda dropshipping";
  const adminBaseUrl = resolveAdminUrl();
  const adminLoginUrl = adminBaseUrl ? `${adminBaseUrl}/login` : "/login";
  const adminSignupUrl = adminBaseUrl ? `${adminBaseUrl}/login?mode=signup` : "/onboarding";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(14,165,233,0.08),_transparent_26%),linear-gradient(180deg,#020617_0%,#050b16_45%,#0b1220_100%)] text-slate-50">
      <RootAuthHashRedirect />
      <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-slate-800 bg-[linear-gradient(180deg,rgba(9,14,26,0.97),rgba(11,18,32,0.98))] px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] text-lg font-black text-slate-950">
              {brandShort.slice(0, 2)}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-400/80">Dropshipping real</p>
              <h1 className="text-2xl font-black tracking-tight text-slate-100">{brandName}</h1>
            </div>
          </div>
          <nav className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-300 lg:mt-0">
            <Link href="/portal" className="rounded-full px-4 py-2 transition hover:bg-slate-100/10 hover:text-white">
              Seguimiento
            </Link>
            <Link href={adminLoginUrl} className="rounded-full px-4 py-2 transition hover:bg-slate-100/10 hover:text-white">
              Entrar
            </Link>
            <Link href={adminSignupUrl} className="rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sky-100 transition hover:bg-sky-500/20">
              Crear tienda
            </Link>
          </nav>
        </header>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-8 pt-2 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-6">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Tienda por tenant</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{landingTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
              Catálogo, carrito y checkout conectados al backend público. Todo se guarda en Supabase con aislamiento por `tenant_id`.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1.2fr_0.8fr_auto]">
              <input value={tenantSlugInput} onChange={(e) => setTenantSlugInput(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none focus:border-sky-400" placeholder="tenant slug" />
              <button type="button" onClick={() => void loadTenant()} className="rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] px-5 py-3 font-bold text-slate-950">
                Cargar tienda
              </button>
              <button
                type="button"
                onClick={() => {
                  setTenantSlug("");
                  setCatalog([]);
                }}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-3 font-semibold text-slate-100"
              >
                Limpiar
              </button>
            </div>
            {error ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
            {checkoutError ? <p className="mt-4 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">{checkoutError}</p> : null}
            {checkoutSuccess ? (
              <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Pedido creado: <span className="font-bold">{checkoutSuccess.order.folio}</span>. Total {money(checkoutSuccess.total)}.
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Productos</p>
              <div className="mt-3 text-3xl font-black">{catalog.length}</div>
            </div>
            <div className="rounded-[1.6rem] border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">En carrito</p>
              <div className="mt-3 text-3xl font-black">{cartItems.length}</div>
            </div>
            <div className="rounded-[1.6rem] border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total</p>
              <div className="mt-3 text-3xl font-black">{money(total)}</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(24,20,16,0.98))] p-5">
            <div className="flex flex-wrap items-center gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 flex-1 rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none focus:border-sky-400" placeholder="Buscar producto, marca o SKU" />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none focus:border-sky-400">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas las categorías" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loading ? <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">Cargando catálogo real...</div> : null}
              {!loading && filteredCatalog.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-sky-300">{item.sku}</p>
                      <h3 className="mt-2 text-xl font-black">{item.name}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${item.inventory_state === "agotado" ? "bg-rose-500/15 text-rose-200" : item.inventory_state === "bajo" ? "bg-sky-500/15 text-sky-200" : "bg-emerald-500/15 text-emerald-200"}`}>
                      {item.inventory_state}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.brand ?? "Sin marca"} {item.category ? `· ${item.category}` : ""}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Precio</p>
                      <div className="mt-1 text-2xl font-black text-sky-300">{money(Number(item.sale_price ?? 0))}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, (cart[item.id] ?? 0) + 1)}
                      disabled={!item.in_stock}
                      className="rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Agregar
                    </button>
                  </div>
                </article>
              ))}
              {!loading && filteredCatalog.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">No hay productos para este tenant o filtros.</div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="text-2xl font-black">Carrito</h3>
            <div className="mt-4 space-y-3">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{product.sku}</p>
                    </div>
                    <button type="button" onClick={() => setQuantity(product.id, 0)} className="text-xs font-semibold text-rose-300">
                      Quitar
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(product.id, Number(e.target.value))}
                      className="w-20 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-center text-slate-50 outline-none"
                    />
                    <div className="text-sm font-bold text-sky-300">{money(quantity * Number(product.sale_price ?? 0))}</div>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-sm text-slate-400">Tu carrito está vacío.</div> : null}
            </div>

            <div className="mt-4 space-y-2 rounded-3xl border border-slate-800 bg-slate-950/50 p-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between"><span>Envío</span><span>{shipping === 0 ? "Gratis" : money(shipping)}</span></div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-black"><span>Total</span><span>{money(total)}</span></div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="text-2xl font-black">Checkout</h3>
            <div className="mt-4 grid gap-3">
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="Nombre completo" />
              <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="Teléfono" />
              <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="Correo opcional" />
              <input value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="Dirección" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={city} onChange={(e) => setCity(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="Ciudad" />
                <input value={state} onChange={(e) => setState(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="Estado" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="CP" />
                <input value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-50 outline-none" placeholder="Notas" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => void checkout()}
              disabled={checkoutLoading}
              className="mt-4 w-full rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] px-5 py-4 text-sm font-black text-slate-950 transition hover:brightness-110 disabled:opacity-60"
            >
              {checkoutLoading ? "Creando pedido..." : "Confirmar pedido"}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
