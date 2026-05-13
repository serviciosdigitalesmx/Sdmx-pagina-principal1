import { fixService } from './services/fixService';
import { CONFIG } from './config';

type GastoRecord = SrFix.GastoRecord;
type GastosListResponse = SrFix.GastosListResponse;
type GastosResumenResponse = SrFix.GastosResumenResponse;
type GastoGuardadoResponse = SrFix.GastoGuardadoResponse;

const PAGE_SIZE = 100;

const elRows = requireElement<HTMLTableSectionElement>('rows');
const elLoading = requireElement<HTMLDivElement>('loading');
const elEmpty = requireElement<HTMLDivElement>('empty');
const elBtnMore = requireElement<HTMLButtonElement>('btn-more');
const elFiltroTexto = requireElement<HTMLInputElement>('filtro-texto');
const elFiltroCategoria = requireElement<HTMLSelectElement>('filtro-categoria');
const elFiltroSucursal = requireElement<HTMLSelectElement>('filtro-sucursal');

const modalGasto = requireElement<HTMLDivElement>('modal-gasto');
const formGasto = requireElement<HTMLFormElement>('form-gasto');

let currentPage = 1;
let hasMore = false;
let isLoading = false;
let gastosCache: GastoRecord[] = [];

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

function renderRows(items: GastoRecord[], append = false): void {
  if (!append) elRows.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach((gasto) => {
    const tr = document.createElement('tr');
    tr.className = 'border-t border-[#1F7EDC]/20 hover:bg-[#1F7EDC]/10 transition-colors';
    tr.innerHTML = `
      <td class="px-3 py-3">
        <div class="font-medium text-white">${escapeHtml(gasto.CATEGORIA)}</div>
        <div class="text-[10px] text-[#8A8F95]">${escapeHtml(gasto.FECHA)}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-xs text-white">${escapeHtml(gasto.DESCRIPCION || '---')}</div>
        <div class="text-[10px] text-[#8A8F95]">${escapeHtml(gasto.SUCURSAL)}</div>
      </td>
      <td class="px-3 py-3 font-semibold text-red-400">${money(gasto.TOTAL)}</td>
      <td class="px-3 py-3">
        <div class="flex gap-2">
          <button data-edit="${escapeHtml(gasto.ID)}" class="px-2 py-1 rounded border border-[#1F7EDC]/30 text-xs hover:bg-[#1F7EDC]/20"><i class="fa-solid fa-pen"></i></button>
        </div>
      </td>
    `;
    frag.appendChild(tr);
  });
  elRows.appendChild(frag);
}

async function cargarGastos({ append = false } = {}): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  if (!append) currentPage = 1;
  elLoading.classList.remove('hidden');
  try {
    const data = await fixService.request<GastosListResponse>('listar_gastos', {
      page: currentPage,
      pageSize: PAGE_SIZE,
      texto: elFiltroTexto.value.trim(),
      categoria: elFiltroCategoria.value,
      sucursal: elFiltroSucursal.value
    }, 'POST');
    const items = Array.isArray(data.items) ? data.items : [];
    if (!append) gastosCache = items.slice();
    else gastosCache = gastosCache.concat(items);
    hasMore = !!data.hasMore;
    renderRows(items, append);
    elEmpty.classList.toggle('hidden', gastosCache.length > 0);
    elBtnMore.classList.toggle('hidden', !hasMore);
    if (hasMore) currentPage += 1;
  } catch (e) {
    console.error('Error cargando gastos:', e);
  } finally {
    isLoading = false;
    elLoading.classList.add('hidden');
  }
}

function abrirModalGasto(gasto?: GastoRecord): void {
  formGasto.reset();
  if (gasto) {
    requireElement<HTMLInputElement>('gasto-id').value = gasto.ID;
    requireElement<HTMLInputElement>('gasto-fecha').value = gasto.FECHA || '';
    requireElement<HTMLSelectElement>('gasto-categoria').value = gasto.CATEGORIA || '';
    requireElement<HTMLSelectElement>('gasto-sucursal').value = gasto.SUCURSAL || '';
    requireElement<HTMLInputElement>('gasto-total').value = String(gasto.TOTAL || 0);
    requireElement<HTMLTextAreaElement>('gasto-descripcion').value = gasto.DESCRIPCION || '';
    requireElement<HTMLElement>('modal-title').textContent = 'Editar Gasto';
  } else {
    requireElement<HTMLInputElement>('gasto-id').value = '';
    requireElement<HTMLInputElement>('gasto-fecha').value = new Date().toISOString().slice(0, 10);
    requireElement<HTMLSelectElement>('gasto-sucursal').value = localStorage.getItem('srfix_sucursal_activa') || 'GLOBAL';
    requireElement<HTMLElement>('modal-title').textContent = 'Nuevo Gasto';
  }
  modalGasto.classList.remove('hidden');
}

async function guardarGasto(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  const payload = {
    id: requireElement<HTMLInputElement>('gasto-id').value,
    fecha: requireElement<HTMLInputElement>('gasto-fecha').value,
    categoria: requireElement<HTMLSelectElement>('gasto-categoria').value,
    sucursal: requireElement<HTMLSelectElement>('gasto-sucursal').value,
    total: Number(requireElement<HTMLInputElement>('gasto-total').value),
    descripcion: requireElement<HTMLTextAreaElement>('gasto-descripcion').value.trim()
  };
  try {
    await fixService.request('guardar_gasto', payload, 'POST');
    modalGasto.classList.add('hidden');
    await cargarGastos({ append: false });
  } catch (error) {
    alert(error instanceof Error ? error.message : String(error));
  }
}

function initListeners(): void {
  requireElement<HTMLButtonElement>('btn-refresh').addEventListener('click', () => void cargarGastos({ append: false }));
  requireElement<HTMLButtonElement>('btn-nuevo').addEventListener('click', () => abrirModalGasto());
  elBtnMore.addEventListener('click', () => { if (hasMore) void cargarGastos({ append: true }); });
  formGasto.addEventListener('submit', (ev) => void guardarGasto(ev));

  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => modalGasto.classList.add('hidden'));
  });

  ['filtro-texto', 'filtro-categoria', 'filtro-sucursal'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => void cargarGastos({ append: false }));
  });

  elRows.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const edit = target?.closest('[data-edit]') as HTMLElement | null;
    if (edit) {
      const g = gastosCache.find((item) => item.ID === edit.getAttribute('data-edit'));
      if (g) abrirModalGasto(g);
    }
  });

  void cargarGastos({ append: false });
}

initListeners();
