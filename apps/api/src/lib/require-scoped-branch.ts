import { Request } from 'express';

export class BranchScopeError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 403,
    public readonly code = 'BRANCH_SCOPE_DENIED',
  ) {
    super(message);
  }
}

export function requireScopedBranch(req: Request): string {
  const branchId = req.scope?.sucursalId;

  if (!branchId) {
    throw new BranchScopeError('Selecciona una sucursal válida', 400, 'BRANCH_REQUIRED');
  }

  return branchId;
}
