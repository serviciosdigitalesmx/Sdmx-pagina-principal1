import { fixService } from './services/fixService';
import { CONFIG } from './config';

type ProveedorRecord = SrFix.ProveedorRecord;
type ProveedoresListResponse = SrFix.ProveedoresListResponse;

const PAGE_SIZE = 80;

const elRows = requireElement<HTMLTableSectionElement>('rows');
const elLoading = requireElement<HTMLDivElement>('loading');
const elEmpty = requireElement<HTMLDivElement>('empty');
const elBtnMore = requireElement<HTMLButtonElement>('btn-more');
const filtroTexto = requireElement<HTMLInputElement>('filtro-texto');
const filtroEstatus = requireElement<HTMLSelectElement>('filtro-estatus');
const filtroCategoria = requireElement<HTMLSelectElement>('filtro-categoria');

let currentPage = 1;
let hasMore = false;
let isLoading = false;
let proveedoresCache: ProveedorRecord[] = [];

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

function stars(n: unknown): string {
  const val = Math.max(0, Math.min(5, Number(n ?? 0)));
  return '★'.repeat(Math.round(val)) + '☆'.repeat(5 - Math.round(val));
}

function statusBadge(v: unknown): string {
  return String(v ?? '').toLowerCase() === 'activo'
    ? '<span class="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 font-semibold">Activo</span>'
    : '<span class="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-300 font-semibold">Inactivo</span>';
}

function renderRows(items: ProveedorRecord[], append = false): void {
  if (!append) elRows.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach((prov) => {
    const tr = document.createElement('tr');
    tr.className = 'border-t border-[#1F7EDC]/20 hover:bg-[#1F7EDC]/10 transition-colors';
    tr.innerHTML = `
      <td class="px-3 py-3">
        <div class="font-semibold text-white">${escapeHtml(prov.NOMBRE)}</div>
        <div class="text-[10px] text-[#8A8F95] uppercase">${escapeHtml(prov.CATEGORIA || 'General')}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-xs text-[#8A8F95]"><i class="fa-solid fa-user-tie mr-1"></i>${escapeHtml(prov.CONTACTO)}</div>
        <div class="text-[10px] text-[#8A8F95]">${escapeHtml(prov.EMAIL || '---')}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-xs text-[#8A8F95]">${escapeHtml(prov.TELEFONO)}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-amber-400 text-xs">${stars(prov.CALIFICACION)}</div>
      </td>
      <td class="px-3 py-3">${statusBadge(prov.ESTATUS)}</td>
      <td class="px-3 py-3">
        <div class="flex gap-2">
          <button data-edit="${escapeHtml(prov.ID)}" class="px-2 py-1 rounded border border-[#1F7EDC]/30 text-xs hover:bg-[#1F7EDC]/20" title="Editar"><i class="fa-solid fa-pen"></i></button>
        </div>
      </td>
    `;
    frag.appendChild(tr);
  });
  elRows.appendChild(frag);
}

async function cargarProveedores({ append = false } = {}): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  if (!append) currentPage = 1;
  elLoading.classList.remove('hidden');
  try {
    const data = await fixService.request<ProveedoresListResponse>('listar_proveedores', {
      page: currentPage,
      pageSize: PAGE_SIZE,
      texto: filtroTexto.value.trim(),
      estatus: filtroEstatus.value,
      categoria: filtroCategoria.value
    }, 'POST');
    const items = Array.isArray(data.rows) ? data.rows : [];
    if (!append) proveedoresCache = items.slice();
    else proveedoresCache = proveedoresCache.concat(items);
    hasMore = !!data.hasMore;
    renderRows(items, append);
    elEmpty.classList.toggle('hidden', proveedoresCache.length > 0);
    elBtnMore.classList.toggle('hidden', !hasMore);
    if (hasMore) currentPage += 1;
  } catch (e) {
    console.error('Error cargando proveedores:', e);
  } finally {
    isLoading = false;
    elLoading.classList.add('hidden');
  }
}

function initListeners(): void {
  requireElement<HTMLButtonElement>('btn-refresh').addEventListener('click', () => void cargarProveedores({ append: false }));
  requireElement<HTMLButtonElement>('btn-nuevo').addEventListener('click', () => { alert('Módulo de proveedores en desarrollo'); });
  elBtnMore.addEventListener('click', () => { if (hasMore) void cargarProveedores({ append: true }); });

  [filtroTexto, filtroEstatus, filtroCategoria].forEach((el) => {
    el.addEventListener('change', () => void cargarProveedores({ append: false }));
  });

  void cargarProveedores({ append: false });
}

initListeners();
