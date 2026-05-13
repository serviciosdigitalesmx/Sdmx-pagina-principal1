import { fixService } from './services/fixService';
import { CONFIG } from './config';

type ClienteRecord = SrFix.ClienteRecord;
type ClientesListResponse = SrFix.ClientesListResponse;
type ClienteDetailResponse = SrFix.ClienteDetailResponse;
type ClienteHistorial = SrFix.ClienteHistorial;
type ClienteHistorialEquipo = SrFix.ClienteHistorialEquipo;
type ClienteHistorialCotizacion = SrFix.ClienteHistorialCotizacion;

const PAGE_SIZE = 80;
const REQUEST_TIMEOUT_MS = 15000;

const elRows = requireElement<HTMLTableSectionElement>('rows');
const elLoading = requireElement<HTMLDivElement>('loading');
const elEmpty = requireElement<HTMLDivElement>('empty');
const elBtnMore = requireElement<HTMLButtonElement>('btn-more');
const filtroTexto = requireElement<HTMLInputElement>('filtro-texto');
const filtroEtiqueta = requireElement<HTMLSelectElement>('filtro-etiqueta');
const filtroDuplicados = requireElement<HTMLSelectElement>('filtro-duplicados');
const filtroRiesgo = requireElement<HTMLSelectElement>('filtro-riesgo');
const elDuplicadosBox = requireElement<HTMLDivElement>('duplicados-box');
const formCliente = requireElement<HTMLFormElement>('form-cliente');
const modalCliente = requireElement<HTMLDivElement>('modal-cliente');
const modalDetalle = requireElement<HTMLDivElement>('modal-detalle');

let currentPage = 1;
let hasMore = false;
let isLoading = false;
let clientesCache: ClienteRecord[] = [];
let duplicadosCache: string[] = [];

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

function getFiltros() {
  return {
    texto: filtroTexto.value.trim(),
    etiqueta: filtroEtiqueta.value,
    duplicados: filtroDuplicados.value,
    riesgo: filtroRiesgo.value
  };
}

function renderRows(items: ClienteRecord[], append = false): void {
  if (!append) elRows.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach((cli) => {
    const tr = document.createElement('tr');
    tr.className = `border-t border-[#1F7EDC]/20 hover:bg-[#1F7EDC]/10 transition-colors ${cli.MOROSO ? 'bg-red-500/5' : ''}`;
    tr.innerHTML = `
      <td class="px-3 py-3">
        <div class="font-semibold text-white">${escapeHtml(cli.NOMBRE)}</div>
        <div class="text-[10px] text-[#8A8F95] uppercase">${escapeHtml(cli.ETIQUETA || 'General')}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-xs text-[#8A8F95]"><i class="fa-solid fa-phone mr-1"></i>${escapeHtml(cli.TELEFONO)}</div>
        <div class="text-[10px] text-[#8A8F95]"><i class="fa-solid fa-envelope mr-1"></i>${escapeHtml(cli.EMAIL || '---')}</div>
      </td>
      <td class="px-3 py-3">
        <div class="text-xs ${cli.MOROSO ? 'text-red-400 font-bold' : 'text-[#8A8F95]'}">
          ${cli.MOROSO ? '⚠️ MOROSO / RIESGO' : '✓ Sin adeudos'}
        </div>
      </td>
      <td class="px-3 py-3">
        <div class="flex gap-2">
          <button data-detail="${escapeHtml(cli.ID)}" class="px-2 py-1 rounded border border-[#1F7EDC]/30 text-xs hover:bg-[#1F7EDC]/20" title="Ver Historial"><i class="fa-solid fa-clock-rotate-left"></i></button>
          <button data-edit="${escapeHtml(cli.ID)}" class="px-2 py-1 rounded border border-[#1F7EDC]/30 text-xs hover:bg-[#1F7EDC]/20" title="Editar"><i class="fa-solid fa-pen"></i></button>
        </div>
      </td>
    `;
    frag.appendChild(tr);
  });
  elRows.appendChild(frag);
}

async function cargarClientes({ append = false } = {}): Promise<void> {
  if (isLoading) return;
  isLoading = true;
  if (!append) currentPage = 1;
  elLoading.classList.remove('hidden');
  if (!append) {
    elRows.innerHTML = '';
    elEmpty.classList.add('hidden');
  }
  try {
    const data = await fixService.request<ClientesListResponse>('listar_clientes', {
      page: currentPage,
      pageSize: PAGE_SIZE,
      ...getFiltros()
    }, 'POST');
    const items = Array.isArray(data.items) ? data.items : [];
    if (!append) clientesCache = items.slice();
    else clientesCache = clientesCache.concat(items);
    hasMore = !!data.hasMore;
    renderRows(items, append);
    if (!clientesCache.length) elEmpty.classList.remove('hidden');
    elBtnMore.classList.toggle('hidden', !hasMore);
    if (hasMore) currentPage += 1;
  } catch (e) {
    console.error('Error cargando clientes:', e);
    elEmpty.classList.remove('hidden');
  } finally {
    isLoading = false;
    elLoading.classList.add('hidden');
  }
}

function abrirModalCliente(cli?: ClienteRecord): void {
  formCliente.reset();
  if (cli) {
    requireElement<HTMLInputElement>('cli-id').value = cli.ID;
    requireElement<HTMLInputElement>('cli-nombre').value = cli.NOMBRE;
    requireElement<HTMLInputElement>('cli-tel').value = cli.TELEFONO;
    requireElement<HTMLInputElement>('cli-email').value = cli.EMAIL || '';
    requireElement<HTMLSelectElement>('cli-etiqueta').value = cli.ETIQUETA || 'General';
    requireElement<HTMLSelectElement>('cli-moroso').value = cli.MOROSO ? 'SÍ' : 'NO';
    requireElement<HTMLTextAreaElement>('cli-notas').value = cli.NOTAS || '';
    requireElement<HTMLElement>('modal-cli-title').textContent = 'Editar Cliente';
  } else {
    requireElement<HTMLInputElement>('cli-id').value = '';
    requireElement<HTMLElement>('modal-cli-title').textContent = 'Nuevo Cliente';
  }
  modalCliente.classList.remove('hidden');
}

async function guardarCliente(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  const payload = {
    id: requireElement<HTMLInputElement>('cli-id').value,
    nombre: requireElement<HTMLInputElement>('cli-nombre').value.trim(),
    telefono: requireElement<HTMLInputElement>('cli-tel').value.trim(),
    email: requireElement<HTMLInputElement>('cli-email').value.trim(),
    etiqueta: requireElement<HTMLSelectElement>('cli-etiqueta').value,
    moroso: requireElement<HTMLSelectElement>('cli-moroso').value === 'SÍ',
    notas: requireElement<HTMLTextAreaElement>('cli-notas').value.trim()
  };
  try {
    await fixService.request('guardar_cliente', payload, 'POST');
    modalCliente.classList.add('hidden');
    await cargarClientes({ append: false });
  } catch (error) {
    alert(error instanceof Error ? error.message : String(error));
  }
}

async function verHistorial(id: string): Promise<void> {
  const cli = clientesCache.find((c) => c.ID === id);
  if (!cli) return;
  requireElement<HTMLElement>('det-nombre').textContent = cli.NOMBRE;
  requireElement<HTMLElement>('det-info').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
  modalDetalle.classList.remove('hidden');
  try {
    const data = await fixService.request<ClienteDetailResponse>('obtener_detalle_cliente', { id }, 'POST');
    const equipos = data.historial?.equipos || [];
    requireElement<HTMLElement>('det-info').innerHTML = equipos.length ? `
      <div class="space-y-2">
        ${equipos.map(e => `
          <div class="p-2 rounded border border-[#1F7EDC]/10 bg-[#1F7EDC]/5">
            <div class="flex justify-between font-bold text-white">
              <span>${escapeHtml(e.dispositivo)}</span>
              <span class="text-[#1F7EDC]">${escapeHtml(e.folio)}</span>
            </div>
            <div class="text-[10px] text-[#8A8F95]">${escapeHtml(e.estado)} - ${escapeHtml(e.fecha)}</div>
          </div>
        `).join('')}
      </div>
    ` : '<div class="text-[#8A8F95]">Sin equipos registrados.</div>';
  } catch (e) {
    requireElement<HTMLElement>('det-info').textContent = 'Error al cargar historial.';
  }
}

function initListeners(): void {
  requireElement<HTMLButtonElement>('btn-refresh').addEventListener('click', () => void cargarClientes({ append: false }));
  requireElement<HTMLButtonElement>('btn-nuevo').addEventListener('click', () => abrirModalCliente());
  requireElement<HTMLButtonElement>('btn-more').addEventListener('click', () => { if (hasMore) void cargarClientes({ append: true }); });
  formCliente.addEventListener('submit', (ev) => void guardarCliente(ev));

  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      modalCliente.classList.add('hidden');
      modalDetalle.classList.add('hidden');
    });
  });

  ['filtro-texto', 'filtro-etiqueta', 'filtro-duplicados', 'filtro-riesgo'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => void cargarClientes({ append: false }));
  });

  elRows.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const edit = target?.closest('[data-edit]') as HTMLElement | null;
    const detail = target?.closest('[data-detail]') as HTMLElement | null;
    if (edit) {
      const cli = clientesCache.find((c) => c.ID === edit.getAttribute('data-edit'));
      if (cli) abrirModalCliente(cli);
    }
    if (detail) void verHistorial(String(detail.getAttribute('data-detail')));
  });

  void cargarClientes({ append: false });
}

initListeners();
