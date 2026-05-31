"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireRole } from "@/components/guard/RequireRole";
import { useAuth } from "@/components/guard/use-auth";
import { ModuleShell } from "@/components/dashboard/module-shell";
import { fixService } from "@/services/fixService";
import { ConfirmDialog } from "@white-label/ui";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  activo: boolean;
  ultimo_acceso: string | null;
  last_login_at: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  phone?: string | null;
  sucursalId?: string | null;
};

type UserHistoryRow = {
  id: string;
  folio?: string | null;
  status?: string | null;
  reference?: string | null;
  payment_terms?: string | null;
  expected_date?: string | null;
  total?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type InviteFormState = {
  name: string;
  email: string;
  role: string;
  sucursalId: string;
};

const INITIAL_INVITE: InviteFormState = {
  name: "",
  email: "",
  role: "tecnico",
  sucursalId: "",
};

function formatDate(value: string | null | undefined) {
  if (!value) return "No disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No disponible";
  return date.toLocaleString("es-MX");
}

function roleLabel(role: string) {
  const map: Record<string, string> = {
    admin: "Admin",
    operador: "Operador",
    tecnico: "Técnico",
    cliente: "Cliente",
    compras: "Compras",
    owner: "Owner",
    manager: "Manager",
    technician: "Technician",
  };
  return map[role] ?? role;
}

export default function UsuariosPage() {
  const auth = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState<InviteFormState>(INITIAL_INVITE);
  const [saving, setSaving] = useState(false);
  const [historyUser, setHistoryUser] = useState<UserRow | null>(null);
  const [historyRows, setHistoryRows] = useState<UserHistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [pendingDangerAction, setPendingDangerAction] = useState<null | { title: string; description: string; onConfirm: () => void | Promise<void> }>(null);

  const stats = useMemo(() => {
    const activeUsers = users.filter((user) => user.activo).length;
    const latestLogin = users
      .map((user) => user.ultimo_acceso ?? user.last_login_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

    return [
      { label: "Usuarios", value: String(total || users.length), helper: "Total en el tenant." },
      { label: "Activos", value: String(activeUsers), helper: "Usuarios habilitados." },
      { label: "Último acceso", value: latestLogin ? formatDate(latestLogin) : "No disponible", helper: "Último login detectado." },
    ];
  }, [total, users]);

  async function loadUsers(nextPage = page) {
    try {
      setLoading(true);
      setError("");
      const result = await fixService.getUsers({
        page: nextPage,
        pageSize,
        q: query.trim() || undefined,
        role: roleFilter || undefined,
        status,
      });
      setUsers(result.data as UserRow[]);
      setPage(result.page);
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, roleFilter, status]);

  useEffect(() => {
    if (!historyUser) {
      setHistoryRows([]);
      setHistoryError("");
      return;
    }

    const activeHistoryUser = historyUser;
    let cancelled = false;

    async function loadHistory() {
      try {
        setHistoryLoading(true);
        setHistoryError("");
        const data = await fixService.getUserPurchaseOrders(activeHistoryUser.id);
        if (!cancelled) {
          setHistoryRows(data as UserHistoryRow[]);
        }
      } catch (err) {
        if (!cancelled) {
          setHistoryError(err instanceof Error ? err.message : "No se pudo cargar el historial");
          setHistoryRows([]);
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [historyUser]);

  async function submitInvite() {
    try {
      setSaving(true);
      setError("");
      await fixService.inviteUser({
        name: invite.name.trim(),
        email: invite.email.trim(),
        role: invite.role,
        sucursalId: invite.sucursalId.trim() ? invite.sucursalId.trim() : undefined,
      });
      setShowInvite(false);
      setInvite(INITIAL_INVITE);
      await loadUsers(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo invitar al usuario");
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(user: UserRow, nextRole: string) {
    setPendingDangerAction({
      title: "Cambiar rol",
      description: `Cambiar el rol de ${user.name} a ${roleLabel(nextRole)}.`,
      onConfirm: async () => {
        try {
          setError("");
          await fixService.updateUserRole(user.id, nextRole);
          await loadUsers(page);
          if (historyUser?.id === user.id) {
            setHistoryUser(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "No se pudo actualizar el rol");
        } finally {
          setPendingDangerAction(null);
        }
      },
    });
  }

  async function deactivateUser(user: UserRow) {
    setPendingDangerAction({
      title: "Desactivar usuario",
      description: `Desactivar a ${user.name} lo dejará fuera de acceso hasta reactivarlo.`,
      onConfirm: async () => {
        try {
          setError("");
          await fixService.deactivateUser(user.id);
          await loadUsers(page);
          if (historyUser?.id === user.id) {
            setHistoryUser(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "No se pudo desactivar el usuario");
        } finally {
          setPendingDangerAction(null);
        }
      },
    });
  }

  return (
    <RequireRole allowed={["owner", "manager"]}>
      <ModuleShell
        title="Usuarios y roles"
        subtitle={`Administración real del tenant ${auth.tenantSlug || auth.tenantId}. Invitaciones, roles y actividad.`}
        icon="fas fa-users"
        actionLabel="Invitar usuario"
        onAction={() => setShowInvite(true)}
        secondaryActionLabel="Refrescar"
        secondaryOnAction={() => void loadUsers(page)}
        tertiaryActionLabel="Ver historial"
        tertiaryOnAction={() => historyUser ? setHistoryUser(null) : setError("Selecciona un usuario para ver historial")}
        stats={stats}
        loading={loading || historyLoading}
        columns={[]}
        rows={[]}
        emptyTitle=""
        emptyCopy=""
        showTable={false}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="flex-1">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-amber-100/60">Buscar</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nombre o correo"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500"
              />
            </label>
            <label className="min-w-[180px]">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-amber-100/60">Estado</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as "all" | "active" | "inactive")}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </label>
            <label className="min-w-[180px]">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-amber-100/60">Rol</span>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="operador">Operador</option>
                <option value="tecnico">Técnico</option>
                <option value="compras">Compras</option>
                <option value="cliente">Cliente</option>
              </select>
            </label>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
              <thead className="bg-zinc-900/70 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Usuario</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Último acceso</th>
                  <th className="px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4">
                      <div className="font-medium text-zinc-100">{user.name}</div>
                      <div className="text-xs text-zinc-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(event) => void changeRole(user, event.target.value)}
                        className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="operador">Operador</option>
                        <option value="tecnico">Técnico</option>
                        <option value="compras">Compras</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.activo ? "bg-emerald-500/10 text-emerald-300" : "bg-zinc-800 text-zinc-300"}`}>
                        {user.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-zinc-300">{formatDate(user.ultimo_acceso ?? user.last_login_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setHistoryUser(user)}
                          className="min-h-11 rounded-full border border-zinc-700 px-3 py-3 text-xs font-semibold text-zinc-100 hover:bg-white/5 active:scale-95"
                        >
                          Historial
                        </button>
                        <button
                          type="button"
                          onClick={() => void deactivateUser(user)}
                          className="min-h-11 rounded-full border border-red-700/40 px-3 py-3 text-xs font-semibold text-red-200 hover:bg-red-500/10 active:scale-95"
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                      {error || "No hay usuarios con los filtros actuales."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-400">
            <div>
              Página <span className="text-zinc-100">{page}</span> de usuarios
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => void loadUsers(Math.max(1, page - 1))}
                className="min-h-11 rounded-full border border-zinc-700 px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={!hasMore}
                onClick={() => void loadUsers(page + 1)}
                className="min-h-11 rounded-full border border-zinc-700 px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Historial de compras por usuario</h2>
                <p className="text-sm text-zinc-400">
                  {historyUser ? `Compras asociadas a ${historyUser.name}` : "Selecciona un usuario para ver actividad."}
                </p>
              </div>
              {historyUser ? (
                <button
                  type="button"
                  onClick={() => setHistoryUser(null)}
                  className="min-h-11 rounded-full border border-zinc-700 px-3 py-3 text-xs font-semibold text-zinc-100 active:scale-95"
                >
                  Cerrar
                </button>
              ) : null}
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
              {historyLoading ? (
                <div className="px-4 py-8 text-sm text-zinc-400">Cargando historial…</div>
              ) : historyError ? (
                <div className="px-4 py-8 text-sm text-red-200">{historyError}</div>
              ) : historyRows.length > 0 ? (
                <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                  <thead className="bg-zinc-900/70 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Folio</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                    {historyRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-4 py-3 text-zinc-100">{row.folio ?? row.reference ?? row.id}</td>
                        <td className="px-4 py-3 text-zinc-300">{row.status ?? "No disponible"}</td>
                        <td className="px-4 py-3 text-zinc-300">
                          {typeof row.total === "number" ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(row.total) : "No disponible"}
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{formatDate(row.created_at ?? row.updated_at ?? null)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-4 py-8 text-sm text-zinc-400">
                  {historyUser ? "Este usuario todavía no tiene compras asociadas." : "No hay historial para mostrar."}
                </div>
              )}
            </div>
          </div>
        </div>
      </ModuleShell>

      {showInvite ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">Invitar usuario</h2>
                <p className="text-sm text-zinc-400">Se enviará un enlace para establecer contraseña.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="min-h-11 rounded-full border border-zinc-700 px-3 py-3 text-sm text-zinc-100 active:scale-95"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-amber-100/60">Nombre</span>
                <input
                  value={invite.name}
                  onChange={(event) => setInvite((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
                  placeholder="Nombre completo"
                />
              </label>
              <label>
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-amber-100/60">Correo</span>
                <input
                  type="email"
                  value={invite.email}
                  onChange={(event) => setInvite((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
                  placeholder="correo@empresa.com"
                />
              </label>
              <label>
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-amber-100/60">Rol</span>
                <select
                  value={invite.role}
                  onChange={(event) => setInvite((current) => ({ ...current, role: event.target.value }))}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="operador">Operador</option>
                  <option value="tecnico">Técnico</option>
                  <option value="compras">Compras</option>
                  <option value="cliente">Cliente</option>
                </select>
              </label>
              <label>
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-amber-100/60">Sucursal ID</span>
                <input
                  value={invite.sucursalId}
                  onChange={(event) => setInvite((current) => ({ ...current, sucursalId: event.target.value }))}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
                  placeholder="UUID opcional"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setShowInvite(false)} className="min-h-11 rounded-full border border-zinc-700 px-4 py-3 text-sm text-zinc-100 active:scale-95">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void submitInvite()}
                disabled={saving}
                className="min-h-11 rounded-full bg-amber-50 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
              >
                {saving ? "Invitando…" : "Invitar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ConfirmDialog
        open={Boolean(pendingDangerAction)}
        title={pendingDangerAction?.title ?? ""}
        description={pendingDangerAction?.description ?? ""}
        confirmLabel="Continuar"
        danger
        onConfirm={async () => {
          await pendingDangerAction?.onConfirm();
        }}
        onCancel={() => setPendingDangerAction(null)}
      />
    </RequireRole>
  );
}
