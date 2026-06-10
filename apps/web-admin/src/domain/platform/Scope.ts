export type ScopeMode = 'tenant' | 'branch';

export interface PlatformScope {
  tenantId: string;
  tenantSlug: string;

  branchId: string | null;
  /**
   * Alias temporal para consumidores existentes.
   * La fuente canónica es branchId.
   */
  sucursalId: string | null;
  branchLabel: string;

  verticalCode: string;
  verticalName: string;

  mode: ScopeMode;
}
