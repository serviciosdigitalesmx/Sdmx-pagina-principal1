import { fixService } from './services/fixService';
import { CONFIG } from './config';

type OrdenCompraRecepcionResponse = SrFix.OrdenCompraRecepcionResponse;

interface OrdenCompraProveedorNombre {
  nombre: string;
}

interface OrdenCompraDraftItem {
  sku: string;
  producto: string;
  cantidadPedida: number;
  costoUnitario: number;
  cantidadRecibida: number;
}

const PAGE_SIZE = 80;

const elRows = requireElement<HTMLTableSectionElement>('rows');
const elLoading = requireElement<HTMLDivElement>('loading');
const elEmpty = requireElement<HTMLDivElement>('empty');
const elBtnMore = requireElement<HTMLButtonElement>('btn-more');
const elFiltroTexto = requireElement<HTMLInputElement>('filtro-texto');
const elFiltroEstado = requireElement<HTMLSelectElement>('filtro-estado');

let currentPage = 1;
let hasMore = false;
let isLoading = false;
let comprasCache: any[] = [];

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento no encontrado: ${id}`);
  return el as T;
}

function escapeHtml(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function money(v: unknown): string {
  return `$${Number(v ?? 0).toFixed(2)}`;
}

function badgeEstado(v: string): string {
  const s = String(v || '').toLowerCase();
  if (s === 'pendiente') return '<span class="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300 font-semibold">Pendiente</span>';
  if (s === 'parcial') return '<span class="px-2 py-1 rounded-full text-xs bg-[#1F7EDC]/20 text-[#9dcfff] font-semibold">Recibido Parcial</span>';
  if (s === 'completada') return '<span class="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 font-semibold">Completada</span>';
  return `<span class="px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-300 font-semibold">${v}</span>`;
}

function renderRows(items: any[], append = false): void {
  if (!append) elRows.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach((compra) => {
    const tr = document.createElement('tr');
    tr.className = 'border-t border-[#1F7EDC]/20 hover:bg-[#1F7EDC]/10 transition-colors';
    tr.innerHTML = `
      <td class="px-3 py-3 font-mono text-[#1F7EDC] font-bold">${escapeHtml(compra.ID)}</td>
      <td class="px-3 py-3">
        <div class="font-medium text-white">${escapeHtml(compra.PROVEEDOR)}</div>
        <div class="text-[10px] text-[#8A8F95]">${escapeHtml(compra.FECHA)}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-xs text-white">${compra.ITEMS_COUNT} items</div>
        <div class="text-[10px] text-[#8A8F95]">${money(compra.TOTAL)}</div>
      </td>
      <td class="px-3 py-3">${badgeEstado(compra.ESTADO)}</td>
      <td class="px-3 py-3">
        <div class="flex flex-wrap gap-2">
          <button data-view="${escapeHtml(compra.ID)}" class="px-2 py-1 rounded border border-[#1F7EDC]/30 text-xs hover:bg-[#1F7EDC]/20" title="Ver Detalle"><i class="fa-solid fa-eye"></i></button>
          ${compra.ESTADO !== 'COMPLETADA' ? `<button data-receive="${escapeHtml(compra.ID)}" class="px-2 py-1 rounded border border-green-500/30 text-xs hover:bg-green-500/20" title="Recibir Mercancía"><i class="fa-solid fa-boxes-packing"></i></button>` : ''}
        </div>
      </td>
    `;
    frag.appendChild(tr);
  });
  elRows.appendChild(frag);
}

async function cargarCompras({ append = false } = {}): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  if (!append) currentPage = 1;
  elLoading.classList.remove('hidden');
  if (!append) {
    elRows.innerHTML = '';
    elEmpty.classList.add('hidden');
  }
  try {
    const data = await fixService.request<any>('listar_compras', {
      page: currentPage,
      pageSize: PAGE_SIZE,
      texto: elFiltroTexto.value.trim(),
      estado: elFiltroEstado.value
    }, 'POST');
    const items = Array.isArray(data.items) ? data.items : [];
    if (!append) comprasCache = items.slice();
    else comprasCache = comprasCache.concat(items);
    hasMore = !!data.hasMore;
    renderRows(items, append);
    if (!comprasCache.length) elEmpty.classList.remove('hidden');
    elBtnMore.classList.toggle('hidden', !hasMore);
    if (hasMore) currentPage += 1;
    elLoading.classList.add('hidden');
  } catch (error) {
    console.error('Error cargando compras:', error);
    elLoading.classList.add('hidden');
    elEmpty.classList.remove('hidden');
    elEmpty.textContent = 'Error al conectar con el servidor de compras.';
  } finally {
    isLoading = false;
  }
}

async function verDetalle(id: string): Promise<void> {
  // Implementación similar a otros paneles para ver detalles de la orden de compra
  alert(`Ver detalle de compra: ${id}`);
}

async function recibirMercancia(id: string): Promise<void> {
  // Implementación para abrir modal de recepción de mercancía
  alert(`Recibir mercancía para compra: ${id}`);
}

function initListeners(): void {
  requireElement<HTMLButtonElement>('btn-refresh').addEventListener('click', () => void cargarCompras({ append: false }));
  requireElement<HTMLButtonElement>('btn-nuevo').addEventListener('click', () => { alert('Nueva Orden de Compra en desarrollo'); });
  elBtnMore.addEventListener('click', () => { if (hasMore) void cargarCompras({ append: true }); });

  ['filtro-texto', 'filtro-estado'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => void cargarCompras({ append: false }));
  });

  elRows.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const view = target?.closest('[data-view]') as HTMLElement | null;
    const receive = target?.closest('[data-receive]') as HTMLElement | null;
    if (view) void verDetalle(String(view.getAttribute('data-view')));
    if (receive) void recibirMercancia(String(receive.getAttribute('data-receive')));
  });

  void cargarCompras({ append: false });
}

initListeners();
