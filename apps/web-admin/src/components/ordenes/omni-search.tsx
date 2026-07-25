'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, User, Smartphone, FileText, Loader2 } from 'lucide-react';
import { apiGateway } from '@/services/apiGateway';
import { useDebounce } from 'use-debounce';

export interface OmniSearchResult {
  customers: any[];
  orders: any[];
  catalogs: any[];
}

interface OmniSearchProps {
  onCustomerSelect?: (customer: any) => void;
  onModelSelect?: (model: any) => void;
  onOrderSelect?: (order: any) => void;
  placeholder?: string;
}

export function OmniSearch({ onCustomerSelect, onModelSelect, onOrderSelect, placeholder = 'Buscar cliente, orden, equipo...' }: OmniSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<OmniSearchResult>({ customers: [], orders: [], catalogs: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults({ customers: [], orders: [], catalogs: [] });
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    
    apiGateway.omniSearch(debouncedQuery).then((res) => {
      if (isMounted) {
        setResults(res as unknown as OmniSearchResult); // Temporary cast since we return raw object from server but apiGateway adds success: true wrapper sometimes, but our implementation just returns res.json()
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const hasResults = results.customers.length > 0 || results.orders.length > 0 || results.catalogs.length > 0;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2) setOpen(true);
          }}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {open && query.length >= 2 && (
        <div className="absolute top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {!loading && !hasResults && (
            <div className="p-4 text-center text-sm text-slate-500">No se encontraron resultados</div>
          )}

          {results.customers.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-xs font-semibold text-slate-500">Clientes</div>
              {results.customers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onCustomerSelect?.(c);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.phone} {c.email ? `• ${c.email}` : ''}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.catalogs.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-xs font-semibold text-slate-500">Equipos (Catálogo)</div>
              {results.catalogs.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onModelSelect?.(m);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <Smartphone className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.catalog_brands?.name || 'Marca desconocida'}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.orders.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold text-slate-500">Órdenes</div>
              {results.orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    onOrderSelect?.(o);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900">{o.folio}</div>
                    <div className="text-xs text-slate-500">{o.status}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
