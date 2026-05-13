import { fixService } from './services/fixService';
import { CONFIG } from './config';

type SecurityActionRecord = SrFix.SecurityActionRecord;
type SecurityConfigResponse = SrFix.SecurityConfigResponse;
type SecuritySaveConfigResponse = SrFix.SecuritySaveConfigResponse;
type SecuritySaveUserResponse = SrFix.SecuritySaveUserResponse;
type SecurityUsersResponse = SrFix.SecurityUsersResponse;
type SecurityUserRecord = SrFix.SecurityUserRecord;

const elBtnRefresh = requireElement<HTMLButtonElement>('btn-refresh');
const elBtnReload = requireElement<HTMLButtonElement>('btn-reload');
const elBtnSaveConfig = requireElement<HTMLButtonElement>('btn-save-config');
const elBtnNuevoUsuario = requireElement<HTMLButtonElement>('btn-nuevo-usuario');
const elFormSeguridad = requireElement<HTMLFormElement>('form-seguridad');
const elFormUsuario = requireElement<HTMLFormElement>('form-usuario');
const elAccessDenied = requireElement<HTMLDivElement>('access-denied');
const elUsuariosWrap = requireElement<HTMLDivElement>('usuarios-wrap');
const elAccionesList = requireElement<HTMLDivElement>('acciones-list');
const elUsuariosList = requireElement<HTMLDivElement>('usuarios-list');
const elMensajeAutorizacion = requireElement<HTMLTextAreaElement>('mensaje-autorizacion');
const elBitacoraActiva = requireElement<HTMLInputElement>('bitacora-activa');
const elAdminPasswordActual = requireElement<HTMLInputElement>('admin-password-actual');
const elAdminPassword = requireElement<HTMLInputElement>('admin-password');
const elAdminPasswordConfirm = requireElement<HTMLInputElement>('admin-password-confirm');
const elKpiAcciones = requireElement<HTMLDivElement>('kpi-acciones');
const elKpiAdmin = requireElement<HTMLDivElement>('kpi-admin');
const elKpiBitacora = requireElement<HTMLDivElement>('kpi-bitacora');
const elSaveStatus = requireElement<HTMLDivElement>('save-status');
const elUsuarioStatus = requireElement<HTMLDivElement>('usuario-status');
const elModalUsuario = requireElement<HTMLDivElement>('modal-usuario');
const elModalUsuarioBusy = requireElement<HTMLDivElement>('modal-usuario-busy');
const elUsuarioTitle = requireElement<HTMLHeadingElement>('usuario-title');
const elUsuarioUser = requireElement<HTMLInputElement>('usuario-user');
const elUsuarioNombre = requireElement<HTMLInputElement>('usuario-nombre');
const elUsuarioRol = requireElement<HTMLSelectElement>('usuario-rol');
const elUsuarioActivo = requireElement<HTMLSelectElement>('usuario-activo');
const elUsuarioPassword = requireElement<HTMLInputElement>('usuario-password');
const elUsuarioAdminPasswordActual = requireElement<HTMLInputElement>('usuario-admin-password-actual');
const elUsuarioNotas = requireElement<HTMLTextAreaElement>('usuario-notas');
const elBtnSaveUser = requireElement<HTMLButtonElement>('btn-save-user');

let accionesCache: SecurityActionRecord[] = [];
let usuariosCache: SecurityUserRecord[] = [];

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

async function cargarSeguridad(): Promise<void> {
  try {
    const data = await fixService.request<SecurityConfigResponse>('obtener_config_seguridad', {}, 'POST');
    elMensajeAutorizacion.value = data.config?.mensaje_autorizacion || '';
    elBitacoraActiva.checked = !!data.config?.bitacora_activa;
    elKpiAcciones.textContent = String(data.stats?.acciones_hoy || 0);
    elKpiAdmin.textContent = data.config?.admin_last_change || '---';
    elKpiBitacora.textContent = data.config?.bitacora_activa ? 'Activa' : 'Inactiva';
    
    accionesCache = data.acciones || [];
    renderAcciones();
  } catch (error) {
    console.error('Error cargando seguridad:', error);
  }
}

function renderAcciones(): void {
  elAccionesList.innerHTML = accionesCache.map(a => `
    <div class="p-3 rounded-lg border border-[#1F7EDC]/10 bg-[#1F7EDC]/5 text-[11px]">
      <div class="flex justify-between font-bold text-[#1F7EDC] mb-1">
        <span>${escapeHtml(a.ACCION)}</span>
        <span class="text-[#8A8F95]">${escapeHtml(a.FECHA)}</span>
      </div>
      <div class="text-white">${escapeHtml(a.DESCRIPCION || '')}</div>
      <div class="text-[#8A8F95] mt-1 italic">Autorizado por: ${escapeHtml(a.AUTORIZO || '---')}</div>
    </div>
  `).join('') || '<div class="text-[#8A8F95] text-center py-8">Sin actividad reciente.</div>';
}

async function cargarUsuarios(): Promise<void> {
  try {
    const data = await fixService.request<SecurityUsersResponse>('listar_usuarios', {}, 'POST');
    usuariosCache = data.usuarios || [];
    renderUsuarios();
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
}

function renderUsuarios(): void {
  elUsuariosList.innerHTML = usuariosCache.map(u => `
    <div class="flex items-center justify-between p-3 rounded-lg border border-[#1F7EDC]/20 bg-[#161616]">
      <div>
        <div class="font-bold text-white">${escapeHtml(u.NOMBRE)}</div>
        <div class="text-[10px] text-[#8A8F95] uppercase">${escapeHtml(u.USUARIO)} - ${escapeHtml(u.ROL)}</div>
      </div>
      <div class="flex gap-2">
        <button data-edit="${escapeHtml(u.USUARIO)}" class="p-2 rounded border border-[#1F7EDC]/30 text-[#1F7EDC] hover:bg-[#1F7EDC]/10"><i class="fa-solid fa-user-gear"></i></button>
      </div>
    </div>
  `).join('') || '<div class="text-[#8A8F95] text-center py-8">No hay usuarios registrados.</div>';
}

async function guardarConfig(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  const payload = {
    mensaje_autorizacion: elMensajeAutorizacion.value,
    bitacora_activa: elBitacoraActiva.checked,
    admin_password_actual: elAdminPasswordActual.value,
    admin_password: elAdminPassword.value,
    admin_password_confirm: elAdminPasswordConfirm.value
  };
  try {
    await fixService.request('guardar_config_seguridad', payload, 'POST');
    alert('Configuración guardada correctamente');
    await cargarSeguridad();
  } catch (error) {
    alert(error instanceof Error ? error.message : String(error));
  }
}

function initListeners(): void {
  elBtnRefresh.addEventListener('click', () => void cargarSeguridad());
  elBtnReload.addEventListener('click', () => void cargarUsuarios());
  elFormSeguridad.addEventListener('submit', (ev) => void guardarConfig(ev));
  
  elUsuariosList.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('button[data-edit]') as HTMLButtonElement;
    if (!btn) return;
    const u = usuariosCache.find(item => item.USUARIO === btn.dataset.edit);
    if (u) {
      elUsuarioTitle.textContent = 'Editar Usuario';
      elUsuarioUser.value = u.USUARIO;
      elUsuarioNombre.value = u.NOMBRE || '';
      elUsuarioRol.value = u.ROL || '';
      elUsuarioActivo.value = u.ACTIVO ? 'SÍ' : 'NO';
      elUsuarioNotas.value = u.NOTAS || '';
      elModalUsuario.classList.remove('hidden');
    }
  });

  elBtnNuevoUsuario.addEventListener('click', () => {
    elUsuarioTitle.textContent = 'Nuevo Usuario';
    elFormUsuario.reset();
    elModalUsuario.classList.remove('hidden');
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => elModalUsuario.classList.add('hidden'));
  });

  void cargarSeguridad();
  void cargarUsuarios();
}

initListeners();
