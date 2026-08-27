'use client';

import { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Rule {
  id: string;
  name: string;
  event_type: string;
  action_type: string;
  is_active: boolean;
  condition: unknown;
  action_config: unknown;
}

interface Log {
  id: string;
  event_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  rule?: Rule;
}

function readStatus(value: unknown) {
  if (!value || typeof value !== 'object' || !('status' in value)) return undefined;
  const status = value.status;
  return typeof status === 'string' ? status : undefined;
}

function readTemplate(value: unknown) {
  if (!value || typeof value !== 'object' || !('template' in value)) return undefined;
  const template = value.template;
  return typeof template === 'string' ? template : undefined;
}

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'logs'>('rules');
  const [rules, setRules] = useState<Rule[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // New Rule Modal States
  const [newRuleOpen, setNewRuleOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [eventType, setEventType] = useState('order.status_changed');
  const [targetStatus, setTargetStatus] = useState('listo');
  const [actionType, setActionType] = useState('send_whatsapp');
  const [templateName, setTemplateName] = useState('status_update');
  const [savingRule, setSavingRule] = useState(false);

  const loadRules = async () => {
    setLoading(true);
    try {
      const res = await apiGateway.getAutomationRules();
      setRules(res || []);
    } catch {
      toast.error('Error al cargar reglas');
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await apiGateway.getAutomationLogs();
      setLogs(res || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadRules();
      await loadLogs();
    };

    void initialize();
  }, []);

  const handleCreateRule = async () => {
    if (!ruleName.trim()) {
      toast.error('Ingresa un nombre para la regla.');
      return;
    }

    setSavingRule(true);
    try {
      const payload = {
        name: ruleName,
        event_type: eventType,
        condition: { status: targetStatus },
        action_type: actionType,
        action_config: { template: templateName, recipient: 'client' },
        is_active: true
      };

      await apiGateway.createAutomationRule(payload);
      toast.success('¡Regla de automatización creada!');
      setNewRuleOpen(false);
      setRuleName('');
      loadRules();
    } catch {
      toast.error('Error al crear regla');
    } finally {
      setSavingRule(false);
    }
  };

  const toggleRuleActive = async (rule: Rule) => {
    try {
      await apiGateway.updateAutomationRule(rule.id, {
        is_active: !rule.is_active
      });
      toast.success(`Regla ${!rule.is_active ? 'activada' : 'desactivada'}`);
      loadRules();
    } catch {
      toast.error('Error al actualizar regla');
    }
  };

  return (
    <div className="space-y-6 bg-slate-50 p-6 min-h-[calc(100vh-64px)] text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-sky-500" />
            Automatizaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Reglas de envío automático de notificaciones por WhatsApp o correo (Modo Franquicia).
          </p>
        </div>
        <Button
          onClick={() => setNewRuleOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Regla
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all
            ${activeTab === 'rules'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Reglas Activas
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all
            ${activeTab === 'logs'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'}`}
        >
          Historial de Ejecución (Logs)
        </button>
      </div>

      {activeTab === 'rules' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
          ) : rules.length === 0 ? (
            <div className="col-span-2 text-center py-20 text-slate-400 font-medium">
              No tienes reglas de automatización configuradas.
            </div>
          ) : (
            rules.map(rule => (
              <div key={rule.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{rule.name}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block mt-1.5 w-fit">
                      {rule.event_type}
                    </span>
                  </div>
                  <button onClick={() => toggleRuleActive(rule)}>
                    {rule.is_active ? (
                      <ToggleRight className="h-7 w-7 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-slate-300" />
                    )}
                  </button>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <div>Condición: <strong>Si el estado es &quot;{readStatus(rule.condition) ?? 'no definido'}&quot;</strong></div>
                  <div>Acción: <strong>{rule.action_type === 'send_whatsapp' ? 'Preparar WhatsApp' : rule.action_type === 'send_notification' ? 'Enviar notificación' : 'Acción no disponible'}</strong></div>
                  <div>Plantilla: <strong>{readTemplate(rule.action_config) ?? 'no definida'}</strong></div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <table className="w-full text-sm text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-slate-600 font-semibold">
                <th className="text-left py-3.5 px-4">Fecha</th>
                <th className="text-left py-3.5 px-4">Regla</th>
                <th className="text-left py-3.5 px-4">Evento</th>
                <th className="text-left py-3.5 px-4">Estado</th>
                <th className="text-left py-3.5 px-4">Detalle / Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 font-mono">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{log.rule?.name || 'Regla Eliminada'}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-xs">{log.event_type}</td>
                  <td className="py-3 px-4">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Enviado
                      </span>
                    ) : log.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                        <AlertCircle className="h-3.5 w-3.5" /> Pendiente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                        <AlertCircle className="h-3.5 w-3.5" /> Falló
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">{log.error_message || '—'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No se han registrado ejecuciones de reglas de automatización.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Rule Modal */}
      <Dialog open={newRuleOpen} onOpenChange={setNewRuleOpen}>
        <DialogContent className="bg-white p-6 max-w-md border border-slate-200 shadow-lg rounded-xl">
          <DialogTitle className="text-xl font-bold text-slate-900">Crear Regla de Automatización</DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            Define un evento y una acción automatizada para reducir la carga operativa.
          </DialogDescription>

          <div className="space-y-4 mt-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nombre de la Regla</label>
              <Input
                value={ruleName}
                onChange={e => setRuleName(e.target.value)}
                placeholder="Ej. Notificar al terminar reparación"
                className="border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Disparar al ocurrir</label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
              >
                <option value="order.status_changed">Cambio de estado de Orden</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Si el estado final es</label>
              <select
                value={targetStatus}
                onChange={e => setTargetStatus(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
              >
                <option value="listo">Listo</option>
                <option value="entregado">Entregado</option>
                <option value="reparacion">En Reparación</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Acción a realizar</label>
              <select
                value={actionType}
                onChange={e => setActionType(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
              >
                <option value="send_whatsapp">Preparar WhatsApp para el cliente</option>
                <option value="send_notification">Enviar notificación interna</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Plantilla de Mensaje</label>
              <select
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none"
              >
                <option value="status_update">Actualización de estado</option>
                <option value="order_received">Orden recibida</option>
                <option value="authorization_request">Solicitud de autorización</option>
                <option value="portal_link">Acceso al portal</option>
                <option value="warranty_info">Información de garantía</option>
              </select>
            </div>

            <Button
              onClick={handleCreateRule}
              disabled={savingRule}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2.5 font-semibold mt-4"
            >
              {savingRule ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Crear Regla'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
