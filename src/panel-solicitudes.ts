import { fixService } from './services/fixService';
import { CONFIG } from './config';

type SolicitudesListResponse = SrFix.SolicitudesListResponse;

interface DraftCotizacionItem {
  concepto: string;
  cantidad: number;
  precio: number;
}

const IVA_RATE = 0.16;

const elList = requireElement<HTMLDivElement>('list');
const elLoading = requireElement<HTMLDivElement>('loading');
const elEmpty = requireElement<HTMLDivElement>('empty');
const elCount = requireElement<HTMLSpanElement>('count');
const elModal = requireElement<HTMLDivElement>('cotizacion-modal');
const elCotItems = requireElement<HTMLDivElement>('cot-items');
const elCotFolio = requireElement<HTMLSpanElement>('cot-folio');
const elCotCliente = requireElement<HTMLSpanElement>('cot-cliente');
const elCotTelefono = requireElement<HTMLSpanElement>('cot-telefono');
const elCotEquipo = requireElement<HTMLSpanElement>('cot-equipo');
const elCotProblema = requireElement<HTMLSpanElement>('cot-problema');
const elCotUrgencia = requireElement<HTMLSpanElement>('cot-urgencia');
const elCotNotas = requireElement<HTMLTextAreaElement>('cot-notas');
const elCotAnticipo = requireElement<HTMLInputElement>('cot-anticipo');
const elCotAplicaIva = requireElement<HTMLInputElement>('cot-aplica-iva');
const elCotSubtotal = requireElement<HTMLSpanElement>('cot-subtotal');
const elCotIvaLabel = requireElement<HTMLSpanElement>('cot-iva-label');
const elCotIva = requireElement<HTMLSpanElement>('cot-iva');
const elCotTotal = requireElement<HTMLSpanElement>('cot-total');
const elCotSaldo = requireElement<HTMLSpanElement>('cot-saldo');
const btnRefresh = requireElement<HTMLButtonElement>('btn-refresh');
const btnCotizacionCerrar = requireElement<HTMLButtonElement>('btn-cotizacion-cerrar');

let solicitudesCache: SrFix.SolicitudRecord[] = [];
let cotizacionItems: DraftCotizacionItem[] = [];

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

function renderSolicitudes(items: SrFix.SolicitudRecord[]): void {
  elList.innerHTML = '';
  items.forEach((sol) => {
    const card = document.createElement('div');
    card.className = 'p-4 rounded-xl border border-[#1F7EDC]/20 bg-[#161616] hover:bg-[#1F7EDC]/5 transition-colors cursor-pointer relative group';
    card.dataset.folio = sol.FOLIO_COTIZACION;
    
    card.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div>
          <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase ${sol.URGENCIA === 'Alta' ? 'bg-red-500/20 text-red-300' : 'bg-[#1F7EDC]/20 text-[#1F7EDC]'}">${sol.URGENCIA}</span>
          <div class="text-[#1F7EDC] font-mono text-xs font-bold mt-1">${sol.FOLIO_COTIZACION}</div>
        </div>
        <div class="text-[10px] text-[#8A8F95]">${sol.FECHA_SOLICITUD}</div>
      </div>
      <div class="text-white font-bold mb-1">${escapeHtml(sol.NOMBRE)}</div>
      <div class="text-xs text-[#8A8F95] mb-2"><i class="fa-solid fa-mobile-screen-button mr-1"></i>${escapeHtml(sol.DISPOSITIVO)} ${escapeHtml(sol.MODELO)}</div>
      <div class="text-[11px] text-[#8A8F95] italic line-clamp-2">${escapeHtml(sol.PROBLEMAS)}</div>
    `;
    
    card.addEventListener('click', () => abrirCotizacion(sol));
    elList.appendChild(card);
  });
}

async function cargarSolicitudes(): Promise<void> {
  try {
    const data = await fixService.request<SolicitudesListResponse>('listar_solicitudes', {}, 'POST');
    solicitudesCache = data.rows || [];
    elCount.textContent = String(solicitudesCache.length);
    renderSolicitudes(solicitudesCache);
    elEmpty.classList.toggle('hidden', solicitudesCache.length > 0);
  } catch (error) {
    console.error('Error cargando solicitudes:', error);
  }
}

function abrirCotizacion(sol: SrFix.SolicitudRecord): void {
  elCotFolio.textContent = sol.FOLIO_COTIZACION;
  elCotCliente.textContent = sol.NOMBRE;
  elCotTelefono.textContent = sol.TELEFONO;
  elCotEquipo.textContent = `${sol.DISPOSITIVO} ${sol.MODELO}`;
  elCotProblema.textContent = sol.PROBLEMAS || '';
  elCotUrgencia.textContent = sol.URGENCIA || 'Normal';
  elCotNotas.value = '';
  elCotAnticipo.value = '0';
  elCotAplicaIva.checked = false;
  
  cotizacionItems = [{ concepto: 'Diagnóstico y Reparación', cantidad: 1, precio: 0 }];
  renderCotItems();
  elModal.classList.remove('hidden');
}

function renderCotItems(): void {
  elCotItems.innerHTML = '';
  cotizacionItems.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'flex gap-2 mb-2 items-center';
    row.innerHTML = `
      <input type="text" class="bg-[#0f0f0f] border border-[#1F7EDC]/30 rounded px-2 py-1 text-xs text-white flex-1" value="${escapeHtml(item.concepto)}" data-idx="${idx}" data-prop="concepto">
      <input type="number" class="bg-[#0f0f0f] border border-[#1F7EDC]/30 rounded px-2 py-1 text-xs text-white w-16 text-center" value="${item.cantidad}" data-idx="${idx}" data-prop="cantidad">
      <input type="number" class="bg-[#0f0f0f] border border-[#1F7EDC]/30 rounded px-2 py-1 text-xs text-white w-20 text-right" value="${item.precio}" data-idx="${idx}" data-prop="precio">
      <button class="text-red-400 hover:text-red-300 px-2" data-idx="${idx}" data-action="remove"><i class="fa-solid fa-trash-can"></i></button>
    `;
    elCotItems.appendChild(row);
  });
  actualizarTotales();
}

function actualizarTotales(): void {
  let subtotal = 0;
  cotizacionItems.forEach(item => subtotal += (item.cantidad * item.precio));
  
  const iva = elCotAplicaIva.checked ? (subtotal * IVA_RATE) : 0;
  const total = subtotal + iva;
  const anticipo = Number(elCotAnticipo.value || 0);
  const saldo = total - anticipo;
  
  elCotSubtotal.textContent = money(subtotal);
  elCotIva.textContent = money(iva);
  elCotTotal.textContent = money(total);
  elCotSaldo.textContent = money(saldo);
  elCotIvaLabel.classList.toggle('hidden', !elCotAplicaIva.checked);
  elCotIva.classList.toggle('hidden', !elCotAplicaIva.checked);
}

function initListeners(): void {
  btnRefresh.addEventListener('click', () => void cargarSolicitudes());
  btnCotizacionCerrar.addEventListener('click', () => elModal.classList.add('hidden'));
  
  const btnAdd = document.getElementById('btn-cot-item-add');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      cotizacionItems.push({ concepto: '', cantidad: 1, precio: 0 });
      renderCotItems();
    });
  }
  
  elCotItems.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const idx = Number(target.dataset.idx);
    const prop = target.dataset.prop as keyof DraftCotizacionItem;
    if (isNaN(idx) || !cotizacionItems[idx]) return;
    
    if (prop === 'concepto') cotizacionItems[idx].concepto = target.value;
    else if (prop === 'cantidad') cotizacionItems[idx].cantidad = Number(target.value);
    else if (prop === 'precio') cotizacionItems[idx].precio = Number(target.value);
    
    actualizarTotales();
  });
  
  elCotItems.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('button[data-action="remove"]') as HTMLButtonElement;
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    cotizacionItems.splice(idx, 1);
    renderCotItems();
  });
  
  elCotAnticipo.addEventListener('input', () => actualizarTotales());
  elCotAplicaIva.addEventListener('change', () => actualizarTotales());
  
  void cargarSolicitudes();
}

initListeners();
