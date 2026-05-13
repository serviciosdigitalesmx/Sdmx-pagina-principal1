import { fixService } from './services/fixService';
import { CONFIG } from './config';

type StockProductoRecord = SrFix.StockProductoRecord;
type StockListResponse = SrFix.StockListResponse;
type StockFoliosRelacionResponse = SrFix.StockFoliosRelacionResponse;
type StockMovimientosResponse = SrFix.StockMovimientosResponse;
type StockMovimientoRecord = SrFix.StockMovimientoRecord;

const PAGE_SIZE = 80;

const elRows = requireElement<HTMLTableSectionElement>('rows');
const elLoading = requireElement<HTMLDivElement>('loading');
const elEmpty = requireElement<HTMLDivElement>('empty');
const elBtnMore = requireElement<HTMLButtonElement>('btn-more');
const elAlertBox = requireElement<HTMLDivElement>('alert-box');
const elAlertasList = requireElement<HTMLDivElement>('alertas-list');
const elAlertasLoading = requireElement<HTMLDivElement>('alertas-loading');

const filtroTexto = requireElement<HTMLInputElement>('filtro-texto');
const filtroEstado = requireElement<HTMLSelectElement>('filtro-estado');
const filtroCategoria = requireElement<HTMLSelectElement>('filtro-categoria');
const filtroSucursal = requireElement<HTMLSelectElement>('filtro-sucursal');

const modalProducto = requireElement<HTMLDivElement>('modal-producto');
const formProducto = requireElement<HTMLFormElement>('form-producto');
const modalMovimientos = requireElement<HTMLDivElement>('modal-movimientos');
const modalVincular = requireElement<HTMLDivElement>('modal-vincular');

let currentPage = 1;
let hasMore = false;
let isLoading = false;
let stockCache: StockProductoRecord[] = [];

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

function badgeStock(cantidad: number, minimo: number): string {
  const q = Number(cantidad || 0);
  const m = Number(minimo || 0);
  if (q <= 0) return '<span class="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-300 font-semibold">Sin stock</span>';
  if (q <= m) return `<span class="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300 font-semibold">Bajo (${q})</span>`;
  return `<span class="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 font-semibold">${q} unidades</span>`;
}

function getFiltros() {
  return {
    texto: filtroTexto.value.trim(),
    estado: filtroEstado.value,
    categoria: filtroCategoria.value,
    sucursal: filtroSucursal.value
  };
}

function renderRows(items: StockProductoRecord[], append = false): void {
  if (!append) elRows.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach((prod) => {
    const tr = document.createElement('tr');
    tr.className = 'border-t border-[#1F7EDC]/20 hover:bg-[#1F7EDC]/10 transition-colors';
    tr.innerHTML = `
      <td class="px-3 py-3">
        <div class="font-semibold text-[#1F7EDC]">${escapeHtml(prod.SKU || '---')}</div>
        <div class="text-[10px] text-[#8A8F95] uppercase">Ref: ${escapeHtml(prod.ID)}</div>
      </td>
      <td class="px-3 py-3">
        <div class="font-medium text-white">${escapeHtml(prod.PRODUCTO)}</div>
        <div class="text-xs text-[#8A8F95]">${escapeHtml(prod.CATEGORIA)}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-xs text-[#8A8F95]">${escapeHtml(prod.SUCURSAL)}</div>
      </td>
      <td class="px-3 py-3">${badgeStock(prod.CANTIDAD || 0, prod.MINIMO || 0)}</td>
      <td class="px-3 py-3">
        <div class="text-white">${money(prod.PRECIO_VENTA)}</div>
        <div class="text-[10px] text-[#8A8F95]">Costo: ${money(prod.COSTO)}</div>
      </td>
      <td class="px-3 py-3">
        <div class="flex flex-wrap gap-2">
          <button data-edit="${escapeHtml(prod.ID || '')}" class="px-2 py-1 rounded border border-[#1F7EDC]/30 text-xs hover:bg-[#1F7EDC]/20" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button data-history="${escapeHtml(prod.ID || '')}" class="px-2 py-1 rounded border border-amber-500/30 text-xs hover:bg-amber-500/20" title="Historial"><i class="fa-solid fa-clock-rotate-left"></i></button>
          <button data-link="${escapeHtml(prod.ID || '')}" class="px-2 py-1 rounded border border-green-500/30 text-xs hover:bg-green-500/20" title="Vincular a orden"><i class="fa-solid fa-link"></i></button>
        </div>
      </td>
    `;
    frag.appendChild(tr);
  });
  elRows.appendChild(frag);
}

async function cargarStock({ append = false } = {}): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  if (!append) currentPage = 1;
  elLoading.classList.remove('hidden');
  if (!append) {
    elRows.innerHTML = '';
    elEmpty.classList.add('hidden');
  }
  try {
    const data = await fixService.request<StockListResponse>('listar_stock', {
      page: currentPage,
      pageSize: PAGE_SIZE,
      ...getFiltros()
    }, 'POST');
    const items = Array.isArray(data.items) ? data.items : [];
    if (!append) stockCache = items.slice();
    else stockCache = stockCache.concat(items);
    hasMore = !!data.hasMore;
    renderRows(items, append);
    if (!stockCache.length) elEmpty.classList.remove('hidden');
    elBtnMore.classList.toggle('hidden', !hasMore);
    if (hasMore) currentPage += 1;
    elLoading.classList.add('hidden');
  } catch (error) {
    console.error('Error cargando stock:', error);
    elLoading.classList.add('hidden');
    elEmpty.classList.remove('hidden');
    elEmpty.textContent = 'Error de conexión con el almacén.';
  } finally {
    isLoading = false;
  }
}

async function cargarAlertas(): Promise<void> {
  elAlertasLoading.classList.remove('hidden');
  elAlertasList.innerHTML = '';
  try {
    const data = await fixService.request<StockListResponse>('listar_stock', {
      page: 1,
      pageSize: 50,
      estado: 'bajo'
    }, 'POST');
    const items = data.items || [];
    elAlertasLoading.classList.add('hidden');
    if (!items.length) {
      elAlertBox.classList.add('hidden');
      return;
    }
    elAlertBox.classList.remove('hidden');
    elAlertasList.innerHTML = items.map((item) => `
      <div class="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10">
        <div>
          <div class="text-xs font-bold text-red-300">${escapeHtml(item.PRODUCTO)}</div>
          <div class="text-[10px] text-[#8A8F95]">${escapeHtml(item.SUCURSAL)} - SKU: ${escapeHtml(item.SKU)}</div>
        </div>
        <div class="text-right">
          <div class="text-xs font-bold text-white">${item.CANTIDAD} / ${item.MINIMO}</div>
          <div class="text-[9px] text-red-400 uppercase font-bold">Reponer</div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    elAlertasLoading.classList.add('hidden');
  }
}

function abrirModalProducto(prod?: StockProductoRecord): void {
  formProducto.reset();
  if (prod) {
    requireElement<HTMLInputElement>('prod-id').value = prod.ID || '';
    requireElement<HTMLInputElement>('prod-sku').value = prod.SKU || '';
    requireElement<HTMLInputElement>('prod-nombre').value = prod.PRODUCTO || '';
    requireElement<HTMLSelectElement>('prod-categoria').value = prod.CATEGORIA || '';
    requireElement<HTMLSelectElement>('prod-sucursal').value = prod.SUCURSAL || '';
    requireElement<HTMLInputElement>('prod-cantidad').value = String(prod.CANTIDAD || 0);
    requireElement<HTMLInputElement>('prod-minimo').value = String(prod.MINIMO || 0);
    requireElement<HTMLInputElement>('prod-costo').value = String(prod.COSTO || 0);
    requireElement<HTMLInputElement>('prod-precio').value = String(prod.PRECIO_VENTA || 0);
    requireElement<HTMLTextAreaElement>('prod-notas').value = prod.NOTAS || '';
    requireElement<HTMLElement>('modal-prod-title').textContent = 'Editar Producto';
  } else {
    requireElement<HTMLInputElement>('prod-id').value = '';
    requireElement<HTMLElement>('modal-prod-title').textContent = 'Nuevo Producto';
    requireElement<HTMLSelectElement>('prod-sucursal').value = localStorage.getItem('srfix_sucursal_activa') || 'GLOBAL';
  }
  modalProducto.classList.remove('hidden');
}

function cerrarModalProducto(): void {
  modalProducto.classList.add('hidden');
}

async function guardarProducto(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  const guard = (window as any).SRFXSecurityGuard;
  if (!guard || typeof guard.ensureAdminPassword !== 'function') {
    alert('No se pudo validar permisos');
    return;
  }
  const auth = await guard.ensureAdminPassword('guardar cambios en el inventario');
  if (!auth.ok) return;

  const payload = {
    id: requireElement<HTMLInputElement>('prod-id').value,
    sku: requireElement<HTMLInputElement>('prod-sku').value.trim(),
    producto: requireElement<HTMLInputElement>('prod-nombre').value.trim(),
    categoria: requireElement<HTMLSelectElement>('prod-categoria').value,
    sucursal: requireElement<HTMLSelectElement>('prod-sucursal').value,
    cantidad: Number(requireElement<HTMLInputElement>('prod-cantidad').value),
    minimo: Number(requireElement<HTMLInputElement>('prod-minimo').value),
    costo: Number(requireElement<HTMLInputElement>('prod-costo').value),
    precio: Number(requireElement<HTMLInputElement>('prod-precio').value),
    notas: requireElement<HTMLTextAreaElement>('prod-notas').value.trim()
  };

  try {
    await fixService.request('guardar_producto_stock', payload, 'POST');
    cerrarModalProducto();
    await cargarStock({ append: false });
    await cargarAlertas();
  } catch (error) {
    alert(error instanceof Error ? error.message : String(error));
  }
}

async function verHistorial(id: string): Promise<void> {
  const prod = stockCache.find((p) => p.ID === id);
  if (!prod) return;
  requireElement<HTMLElement>('movs-title').textContent = `Movimientos: ${prod.PRODUCTO}`;
  requireElement<HTMLElement>('movs-body').innerHTML = '<div class="p-8 text-center"><i class="fa-solid fa-circle-notch fa-spin text-2xl text-[#1F7EDC]"></i></div>';
  modalMovimientos.classList.remove('hidden');
  try {
    const data = await fixService.request<StockMovimientosResponse>('listar_movimientos_stock', { id }, 'POST');
    const movs = data.movimientos || [];
    if (!movs.length) {
      requireElement<HTMLElement>('movs-body').innerHTML = '<div class="p-8 text-center text-[#8A8F95]">No hay movimientos registrados para este SKU.</div>';
      return;
    }
    requireElement<HTMLElement>('movs-body').innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-[10px] uppercase text-[#8A8F95] border-b border-[#1F7EDC]/10">
            <tr>
              <th class="px-2 py-2">Fecha</th>
              <th class="px-2 py-2">Tipo</th>
              <th class="px-2 py-2 text-right">Cant</th>
              <th class="px-2 py-2">Responsable / Notas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1F7EDC]/5">
            ${movs.map((m) => `
              <tr>
                <td class="px-2 py-2 whitespace-nowrap text-[11px]">${escapeHtml(m.FECHA)}</td>
                <td class="px-2 py-2">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${m.TIPO === 'ENTRADA' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}">${m.TIPO}</span>
                </td>
                <td class="px-2 py-2 text-right font-mono">${m.CANTIDAD}</td>
                <td class="px-2 py-2 text-[11px]">
                  <div class="font-bold text-white">${escapeHtml(m.RESPONSABLE)}</div>
                  <div class="text-[#8A8F95]">${escapeHtml(m.NOTAS || '')}</div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (e) {
    requireElement<HTMLElement>('movs-body').innerHTML = '<div class="p-8 text-center text-red-400">Error al cargar historial.</div>';
  }
}

async function abrirVincular(id: string): Promise<void> {
  const prod = stockCache.find((p) => p.ID === id);
  if (!prod) return;
  requireElement<HTMLInputElement>('vinc-prod-id').value = id;
  requireElement<HTMLElement>('vinc-prod-nombre').textContent = prod.PRODUCTO;
  requireElement<HTMLElement>('vinc-prod-sku').textContent = prod.SKU;
  requireElement<HTMLInputElement>('vinc-folio').value = '';
  requireElement<HTMLElement>('vinc-folio-info').innerHTML = '';
  modalVincular.classList.remove('hidden');
}

async function buscarFolioVincular(): Promise<void> {
  const folio = requireElement<HTMLInputElement>('vinc-folio').value.trim().toUpperCase();
  if (!folio) return;
  requireElement<HTMLElement>('vinc-folio-info').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
  try {
    const res = await fixService.request<StockFoliosRelacionResponse>('buscar_folio_stock', { folio }, 'POST');
    if (!res.ok) {
      requireElement<HTMLElement>('vinc-folio-info').innerHTML = `<span class="text-red-400 text-xs">${res.error || 'Folio no encontrado'}</span>`;
      return;
    }
    requireElement<HTMLElement>('vinc-folio-info').innerHTML = `
      <div class="p-2 rounded bg-[#1F7EDC]/10 border border-[#1F7EDC]/20 text-xs">
        <div class="font-bold text-white">${escapeHtml(res.equipo)}</div>
        <div class="text-[#8A8F95]">${escapeHtml(res.cliente)}</div>
      </div>
    `;
  } catch (e) {
    requireElement<HTMLElement>('vinc-folio-info').innerHTML = '<span class="text-red-400 text-xs">Error de red</span>';
  }
}

async function confirmarVinculacion(): Promise<void> {
  const id = requireElement<HTMLInputElement>('vinc-prod-id').value;
  const folio = requireElement<HTMLInputElement>('vinc-folio').value.trim().toUpperCase();
  if (!id || !folio) return;
  try {
    await fixService.request('vincular_producto_folio', { id, folio }, 'POST');
    modalVincular.classList.add('hidden');
    await cargarStock({ append: false });
  } catch (error) {
    alert(error instanceof Error ? error.message : String(error));
  }
}

function initListeners(): void {
  requireElement<HTMLButtonElement>('btn-refresh').addEventListener('click', () => void cargarStock({ append: false }));
  requireElement<HTMLButtonElement>('btn-nuevo').addEventListener('click', () => abrirModalProducto());
  requireElement<HTMLButtonElement>('btn-more').addEventListener('click', () => { if (hasMore) void cargarStock({ append: true }); });

  formProducto.addEventListener('submit', (ev) => void guardarProducto(ev));
  requireElement<HTMLButtonElement>('vinc-buscar').addEventListener('click', () => void buscarFolioVincular());
  requireElement<HTMLButtonElement>('vinc-confirmar').addEventListener('click', () => void confirmarVinculacion());

  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      cerrarModalProducto();
      modalMovimientos.classList.add('hidden');
      modalVincular.classList.add('hidden');
    });
  });

  ['filtro-texto', 'filtro-estado', 'filtro-categoria', 'filtro-sucursal'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(id === 'filtro-texto' ? 'input' : 'change', () => void cargarStock({ append: false }));
  });

  elRows.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const edit = target?.closest('[data-edit]') as HTMLElement | null;
    const history = target?.closest('[data-history]') as HTMLElement | null;
    const link = target?.closest('[data-link]') as HTMLElement | null;
    if (edit) {
      const prod = stockCache.find((p) => p.ID === edit.getAttribute('data-edit'));
      if (prod) abrirModalProducto(prod);
    }
    if (history) void verHistorial(String(history.getAttribute('data-history')));
    if (link) void abrirVincular(String(link.getAttribute('data-link')));
  });

  const sucursalDefault = localStorage.getItem('srfix_sucursal_activa') || 'GLOBAL';
  filtroSucursal.value = sucursalDefault;

  void cargarStock({ append: false });
  void cargarAlertas();
}

initListeners();
