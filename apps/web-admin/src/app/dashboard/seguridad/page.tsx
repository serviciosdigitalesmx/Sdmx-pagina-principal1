"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireRole } from "@/components/guard/RequireRole";
import { useAuth } from "@/components/guard/use-auth";
import { ModuleShell } from "@/components/dashboard/module-shell";
import { fixService } from "@/services/fixService";
import { ConfirmDialog } from "@white-label/ui";

type SecuritySummary = {
  tenantId: string | null;
  userId: string | null;
  role: string | null;
  email: string | null;
  sucursalId: string | null;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageTenantSettings: boolean;
};

type TenantBillingSummary = {
  tenantId: string;
  tenantSlug: string;
  subscriptionStatus: string;
  trialExpiresAt: string | null;
  billingExempt: boolean;
  isTrialActive: boolean;
  isBillingBlocked: boolean;
  daysLeft: number | null;
  upgradeHref: string | null;
};

type AuditRow = {
  id: string;
  action: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  data_before: Record<string, unknown> | null;
  data_after: Record<string, unknown> | null;
  created_at: string;
};

type SecuritySessionRow = {
  id: string;
  userId: string;
  sessionKey: string;
  ipAddress: string | null;
  userAgent: string | null;
  lastActivityAt: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
};

function formatDate(value?: string | null) {
  if (!value) return "No disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No disponible";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function SeguridadPage() {
  const { role } = useAuth();
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [billing, setBilling] = useState<TenantBillingSummary | null>(null);
  const [auditRows, setAuditRows] = useState<AuditRow[]>([]);
  const [sessions, setSessions] = useState<SecuritySessionRow[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [mfaState, setMfaState] = useState<{ secret: string; uri: string; mfaEnabled: boolean } | null>(null);
  const [requireAdminMfa, setRequireAdminMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [auditAction, setAuditAction] = useState("");
  const [auditUserId, setAuditUserId] = useState("");
  const [auditFrom, setAuditFrom] = useState("");
  const [auditTo, setAuditTo] = useState("");
  const [error, setError] = useState("");
  const [auditError, setAuditError] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDangerAction, setPendingDangerAction] = useState<null | { title: string; description: string; onConfirm: () => void | Promise<void> }>(null);

  async function refreshSecurity() {
    try {
      setError("");
      const [data, tenantSettings] = await Promise.all([
        fixService.getSecuritySummary() as Promise<SecuritySummary>,
        fixService.getTenantSettings(),
      ]);
      setSummary(data);
      setBilling((tenantSettings.data.billing ?? null) as TenantBillingSummary | null);
      setRequireAdminMfa(Boolean((tenantSettings.data.tenant as Record<string, unknown>).require_admin_mfa));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar seguridad");
    }
  }

  async function loadAudit() {
    try {
      setAuditLoading(true);
      setAuditError("");
      const result = await fixService.getAuditLogs({
        page: 1,
        pageSize: 100,
        action: auditAction.trim() || undefined,
        userId: auditUserId.trim() || undefined,
        from: auditFrom.trim() || undefined,
        to: auditTo.trim() || undefined,
      });
      setAuditRows(result.data as AuditRow[]);
    } catch (err) {
      setAuditError(err instanceof Error ? err.message : "No se pudo cargar auditoría");
      setAuditRows([]);
    } finally {
      setAuditLoading(false);
    }
  }

  async function loadSessions() {
    try {
      setSessionLoading(true);
      setSessionError("");
      const data = await fixService.getSecuritySessions();
      setSessions(data as SecuritySessionRow[]);
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : "No se pudieron cargar sesiones");
      setSessions([]);
    } finally {
      setSessionLoading(false);
    }
  }

  async function rotateKeys() {
    setPendingDangerAction({
      title: "Rotar llaves",
      description: "Esta acción invalidará las sesiones activas del tenant.",
      onConfirm: async () => {
        try {
          setSaving(true);
          await fixService.rotateSecurityKeys(true);
          await Promise.all([loadAudit(), loadSessions()]);
          await refreshSecurity();
        } catch (err) {
          setError(err instanceof Error ? err.message : "No se pudo rotar la llave");
        } finally {
          setSaving(false);
          setPendingDangerAction(null);
        }
      },
    });
  }

  async function revokeSession(id: string) {
    setPendingDangerAction({
      title: "Revocar sesión",
      description: "La sesión quedará sin acceso de inmediato.",
      onConfirm: async () => {
        try {
          setSaving(true);
          await fixService.revokeSecuritySession(id);
          await Promise.all([loadAudit(), loadSessions()]);
        } catch (err) {
          setError(err instanceof Error ? err.message : "No se pudo revocar la sesión");
        } finally {
          setSaving(false);
          setPendingDangerAction(null);
        }
      },
    });
  }

  async function setupMfa() {
    try {
      setSaving(true);
      const data = await fixService.getMfaSetup();
      setMfaState({
        secret: String((data as { secret?: string }).secret ?? ""),
        uri: String((data as { uri?: string }).uri ?? ""),
        mfaEnabled: Boolean((data as { mfaEnabled?: boolean }).mfaEnabled),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar MFA");
    } finally {
      setSaving(false);
    }
  }

  async function toggleAdminMfa(enabled: boolean) {
    try {
      setSaving(true);
      setRequireAdminMfa(enabled);
      await fixService.setAdminMfaRequirement(enabled);
      await Promise.all([refreshSecurity(), loadAudit(), loadSessions()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar MFA");
    } finally {
      setSaving(false);
    }
  }

  async function verifyMfa() {
    if (!mfaCode.trim()) {
      setError("Ingresa el código MFA");
      return;
    }
    try {
      setSaving(true);
      await fixService.verifyMfaCode(mfaCode.trim());
      setMfaCode("");
      await refreshSecurity();
      await loadAudit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo verificar MFA");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void refreshSecurity();
    void loadAudit();
    void loadSessions();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Tenant", value: summary?.tenantId ?? "No disponible", helper: "Entorno de datos aislado." },
      { label: "Usuario", value: summary?.userId ?? "No disponible", helper: "Tu sesión actual." },
      { label: "Sucursal", value: summary?.sucursalId ?? "No disponible", helper: "Tu sucursal actual." },
      {
        label: "Suscripción",
        value: billing?.subscriptionStatus ?? "trial",
        helper: billing?.isBillingBlocked ? "Bloqueado por trial vencido." : "Operación habilitada.",
      },
    ],
    [billing?.isBillingBlocked, billing?.subscriptionStatus, role, summary]
  );

  return (
    <RequireRole allowed={["owner", "manager"]}>
      <ModuleShell
        title="Seguridad y roles"
        subtitle="Resumen de sesión, auditoría, sesiones activas, MFA y rotación de secretos."
        icon="fas fa-shield-alt"
        actionLabel="Actualizar"
        onAction={() => void refreshSecurity()}
        secondaryActionLabel="Rotar llaves"
        secondaryOnAction={() => void rotateKeys()}
        tertiaryActionLabel="Configurar MFA"
        tertiaryOnAction={() => void setupMfa()}
        stats={stats}
        loading={auditLoading || sessionLoading}
        columns={[]}
        rows={[]}
        emptyTitle=""
        emptyCopy=""
        showTable={false}
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Auditoría</h2>
                <p className="text-sm text-zinc-400">Últimos 100 eventos del tenant.</p>
              </div>
              <button type="button" onClick={() => void loadAudit()} className="min-h-11 rounded-full border border-zinc-700 px-3 py-3 text-xs font-semibold text-zinc-100 active:scale-95">
                Filtrar
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <input value={auditAction} onChange={(e) => setAuditAction(e.target.value)} placeholder="Acción" className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100" />
              <input value={auditUserId} onChange={(e) => setAuditUserId(e.target.value)} placeholder="Usuario ID" className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100" />
              <input value={auditFrom} onChange={(e) => setAuditFrom(e.target.value)} placeholder="Desde (ISO)" className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100" />
              <input value={auditTo} onChange={(e) => setAuditTo(e.target.value)} placeholder="Hasta (ISO)" className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100" />
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
              {auditLoading ? (
                <div className="px-4 py-8 text-sm text-zinc-400">Cargando auditoría…</div>
              ) : auditError ? (
                <div className="px-4 py-8 text-sm text-red-200">{auditError}</div>
              ) : auditRows.length > 0 ? (
                <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                  <thead className="bg-zinc-900/70 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Acción</th>
                      <th className="px-4 py-3 font-medium">Usuario</th>
                      <th className="px-4 py-3 font-medium">IP</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                    {auditRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-4 py-3 text-zinc-100">{row.action}</td>
                        <td className="px-4 py-3 text-zinc-300">{row.user_id ?? "Sistema"}</td>
                        <td className="px-4 py-3 text-zinc-300">{row.ip_address ?? "No disponible"}</td>
                        <td className="px-4 py-3 text-zinc-300">{formatDate(row.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-4 py-8 text-sm text-zinc-400">Sin eventos para mostrar.</div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-lg font-semibold text-zinc-100">MFA y sesiones</h2>
            <p className="mt-1 text-sm text-zinc-400">Activa MFA para admins y revisa sesiones activas.</p>
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-amber-100/60">MFA</div>
              <div className="mt-2 text-sm text-zinc-200">
                {mfaState ? `Secret cargado. MFA ${mfaState.mfaEnabled ? "habilitado" : "pendiente"}.` : "Configura un secreto para MFA de admin."}
              </div>
              <label className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-200">
                <span>Requerir MFA para admins</span>
                <input
                  type="checkbox"
                  checked={requireAdminMfa}
                  onChange={(event) => void toggleAdminMfa(event.target.checked)}
                  className="h-4 w-4 accent-amber-400"
                />
              </label>
              {mfaState ? (
                <div className="mt-4 space-y-3">
                  <div className="break-all rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300">{mfaState.uri}</div>
                  <div className="flex gap-2">
                    <input value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} placeholder="Código 6 dígitos" className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100" />
                    <button type="button" onClick={() => void verifyMfa()} disabled={saving} className="min-h-11 rounded-full bg-amber-50 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-60 active:scale-95">
                      Verificar
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => void setupMfa()} disabled={saving} className="mt-4 min-h-11 rounded-full bg-amber-50 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-60 active:scale-95">
                  Generar MFA
                </button>
              )}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
              {sessionLoading ? (
                <div className="px-4 py-8 text-sm text-zinc-400">Cargando sesiones…</div>
              ) : sessionError ? (
                <div className="px-4 py-8 text-sm text-red-200">{sessionError}</div>
              ) : sessions.length > 0 ? (
                <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                  <thead className="bg-zinc-900/70 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Usuario</th>
                      <th className="px-4 py-3 font-medium">IP</th>
                      <th className="px-4 py-3 font-medium">Última actividad</th>
                      <th className="px-4 py-3 font-medium">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                    {sessions.map((session) => (
                      <tr key={session.id}>
                        <td className="px-4 py-3 text-zinc-100">
                          <div>{session.user?.name ?? session.user?.email ?? session.userId}</div>
                          <div className="text-xs text-zinc-400">{session.user?.role ?? "No disponible"}</div>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{session.ipAddress ?? "No disponible"}</td>
                        <td className="px-4 py-3 text-zinc-300">{formatDate(session.lastActivityAt)}</td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => void revokeSession(session.id)} className="min-h-11 rounded-full border border-red-700/40 px-3 py-3 text-xs font-semibold text-red-200 active:scale-95">
                            Revocar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-4 py-8 text-sm text-zinc-400">Sin sesiones activas.</div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-amber-700/15 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-5 text-zinc-100 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-100/70">Trial</p>
            <p className="mt-2 text-2xl font-semibold">{billing?.daysLeft ?? "No disponible"} días</p>
            <p className="mt-2 text-sm text-zinc-300">
              {billing?.trialExpiresAt ? `Expira ${new Date(billing.trialExpiresAt).toLocaleDateString('es-MX')}` : "No hay expiración registrada."}
            </p>
          </article>
          <article className="rounded-3xl border border-amber-700/15 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-5 text-zinc-100 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-100/70">Estado</p>
            <p className="mt-2 text-2xl font-semibold">{billing?.subscriptionStatus ?? "trial"}</p>
            <p className="mt-2 text-sm text-zinc-300">
              {billing?.billingExempt ? "Tenancy exenta de cobro." : billing?.isBillingBlocked ? "Limitado por suscripción vencida." : "Operación habilitada."}
            </p>
          </article>
          <article className="rounded-3xl border border-amber-700/15 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-5 text-zinc-100 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-100/70">Upgrade</p>
            <p className="mt-2 text-2xl font-semibold">{billing?.upgradeHref ? "Disponible" : "Pendiente"}</p>
            <p className="mt-2 text-sm text-zinc-300 break-all">
              {billing?.upgradeHref ?? "Configura APP_URL para publicar el enlace de activación."}
            </p>
          </article>
        </div>
      <ConfirmDialog
        open={Boolean(pendingDangerAction)}
        title={pendingDangerAction?.title ?? ""}
        description={pendingDangerAction?.description ?? ""}
        confirmLabel={saving ? "Procesando..." : "Continuar"}
        danger
        onConfirm={async () => {
          await pendingDangerAction?.onConfirm();
        }}
        onCancel={() => setPendingDangerAction(null)}
      />
      </ModuleShell>
    </RequireRole>
  );
}
