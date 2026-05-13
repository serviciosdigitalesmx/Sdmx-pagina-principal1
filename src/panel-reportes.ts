import { fixService } from './services/fixService';
import { CONFIG } from './config';

type ReporteOperativoResumen = SrFix.ReporteOperativoResumen;
type ReporteOperativoDetalle = SrFix.ReporteOperativoDetalle;
type ReporteOperativoResponse = SrFix.ReporteOperativoResponse;

const elFiltroDesde = requireElement<HTMLInputElement>('filtro-desde');
const elFiltroHasta = requireElement<HTMLInputElement>('filtro-hasta');
const elFiltroSucursal = requireElement<HTMLSelectElement>('filtro-sucursal');
const elBtnGenerar = requireElement<HTMLButtonElement>('btn-generar');
const elResultados = requireElement<HTMLDivElement>('resultados');

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
  return `$${Number(v ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getFiltros() {
  return {
    desde: elFiltroDesde.value,
    hasta: elFiltroHasta.value,
    sucursal: elFiltroSucursal.value
  };
}

function renderResumen(resumen: ReporteOperativoResumen): string {
  return `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="p-4 rounded-xl border border-[#1F7EDC]/20 bg-[#161616]">
        <div class="text-[10px] text-[#8A8F95] uppercase font-bold mb-1">Equipos Recibidos</div>
        <div class="text-2xl font-bold text-white">${resumen.totalRecibidos || 0}</div>
      </div>
      <div class="p-4 rounded-xl border border-[#1F7EDC]/20 bg-[#161616]">
        <div class="text-[10px] text-[#8A8F95] uppercase font-bold mb-1">Equipos Entregados</div>
        <div class="text-2xl font-bold text-green-400">${resumen.totalEntregados || 0}</div>
      </div>
      <div class="p-4 rounded-xl border border-[#1F7EDC]/20 bg-[#161616]">
        <div class="text-[10px] text-[#8A8F95] uppercase font-bold mb-1">Cotizaciones</div>
        <div class="text-2xl font-bold text-yellow-400">${resumen.totalCotizaciones || 0}</div>
      </div>
      <div class="p-4 rounded-xl border border-[#1F7EDC]/20 bg-[#161616]">
        <div class="text-[10px] text-[#8A8F95] uppercase font-bold mb-1">Ventas Totales</div>
        <div class="text-2xl font-bold text-[#FF6A2A]">${money(resumen.totalVentas)}</div>
      </div>
    </div>
  `;
}

async function cargarReporte(): Promise<void> {
  elResultados.innerHTML = '<div class="p-12 text-center"><i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#1F7EDC]"></i></div>';
  try {
    const data = await fixService.request<ReporteOperativoResponse>('generar_reporte_operativo', getFiltros(), 'POST');
    const resumen = data.resumen || { totalRecibidos: 0, totalEntregados: 0, totalCotizaciones: 0, totalVentas: 0 };
    let html = renderResumen(resumen);
    
    const detalle = data.detalle || [];
    if (detalle.length > 0) {
      html += `
        <div class="overflow-x-auto rounded-xl border border-[#1F7EDC]/20 bg-[#161616]">
          <table class="w-full text-sm text-left">
            <thead class="bg-[#0f0f0f] text-[#8A8F95] uppercase text-[10px]">
              <tr>
                <th class="px-4 py-3">Concepto</th>
                <th class="px-4 py-3">Cantidad</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1F7EDC]/10">
              ${detalle.map(d => `
                <tr>
                  <td class="px-4 py-3 text-white">${escapeHtml(d.concepto)}</td>
                  <td class="px-4 py-3 text-[#8A8F95]">${d.cantidad}</td>
                  <td class="px-4 py-3 text-right font-mono text-[#1F7EDC]">${money(d.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      html += '<div class="p-12 text-center text-[#8A8F95] border border-dashed border-[#1F7EDC]/20 rounded-xl">No hay datos para el rango seleccionado.</div>';
    }
    elResultados.innerHTML = html;
  } catch (error) {
    elResultados.innerHTML = `<div class="p-12 text-center text-red-400">Error al generar reporte: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
}

function init(): void {
  const hoy = new Date().toISOString().split('T')[0] || '';
  elFiltroDesde.value = hoy;
  elFiltroHasta.value = hoy;
  
  elBtnGenerar.addEventListener('click', () => void cargarReporte());
  void cargarReporte();
}

init();
