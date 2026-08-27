import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PostgrestError } from '@supabase/supabase-js';

// Mapeo de errores conocidos a códigos y mensajes seguros
const ERROR_MAP: Record<string, { status: number; code: string; message: string }> = {
  'ACTIVE_SHIFT_NOT_FOUND': { status: 409, code: 'ACTIVE_SHIFT_NOT_FOUND', message: 'No hay un turno de caja activo' },
  'INSUFFICIENT_STOCK': { status: 409, code: 'INSUFFICIENT_STOCK', message: 'Stock insuficiente' },
  'INVALID_IDEMPOTENCY_KEY': { status: 400, code: 'INVALID_IDEMPOTENCY_KEY', message: 'Clave de idempotencia inválida' },
  'SALE_ITEMS_REQUIRED': { status: 400, code: 'SALE_ITEMS_REQUIRED', message: 'Se requiere al menos un ítem' },
  'INVALID_PAYMENT_METHOD': { status: 400, code: 'INVALID_PAYMENT_METHOD', message: 'Método de pago no soportado' },
  'PRODUCT_NOT_FOUND': { status: 404, code: 'PRODUCT_NOT_FOUND', message: 'Producto no encontrado' },
  'CONCURRENT_STOCK_CONFLICT': { status: 409, code: 'CONCURRENT_STOCK_CONFLICT', message: 'Conflicto de stock concurrente' },
  'BRANCH_REQUIRED': { status: 400, code: 'BRANCH_REQUIRED', message: 'Se requiere una sucursal' },
  'BRANCH_SCOPE_DENIED': { status: 403, code: 'BRANCH_SCOPE_DENIED', message: 'No tienes acceso a esta sucursal' },
  'TENANT_REQUIRED': { status: 401, code: 'TENANT_REQUIRED', message: 'Tenant requerido' },
};

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const error = err instanceof Error ? err : new Error('Unknown error');
  // Log completo para debugging interno (no exponer)
  console.error('[ERROR]', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    requestId: req.headers['x-request-id'],
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Datos inválidos',
      code: 'VALIDATION_ERROR',
      details: err.errors,
      requestId: req.headers['x-request-id'] || null,
    });
  }

  // Postgrest errors (base de datos)
  if (err instanceof PostgrestError) {
    // Mapear errores comunes de Postgres
    if (err.code === '23505') { // unique violation
      return res.status(409).json({
        success: false,
        error: 'Registro duplicado',
        code: 'DUPLICATE_RECORD',
        requestId: req.headers['x-request-id'] || null,
      });
    }
    if (err.code === '23503') { // foreign key violation
      return res.status(409).json({
        success: false,
        error: 'Referencia inválida',
        code: 'FOREIGN_KEY_VIOLATION',
        requestId: req.headers['x-request-id'] || null,
      });
    }
    // Otros errores de base de datos
    return res.status(502).json({
      success: false,
      error: 'Error en la base de datos',
      code: 'DB_ERROR',
      requestId: req.headers['x-request-id'] || null,
    });
  }

  // Errores lanzados con código específico (ej: desde RPC)
  const code = typeof err === 'object' && err !== null && 'code' in err && typeof err.code === 'string'
    ? err.code
    : error.message.match(/^[A-Z_]+/)?.[0];
  if (code && ERROR_MAP[code]) {
    const mapped = ERROR_MAP[code];
    return res.status(mapped.status).json({
      success: false,
      error: mapped.message,
      code: mapped.code,
      requestId: req.headers['x-request-id'] || null,
    });
  }

  // Errores que ya tienen statusCode (como BranchScopeError)
  if (
    typeof err === 'object' && err !== null &&
    'statusCode' in err && typeof err.statusCode === 'number' &&
    'code' in err && typeof err.code === 'string'
  ) {
    return res.status(err.statusCode).json({
      success: false,
      error: 'message' in err && typeof err.message === 'string' ? err.message : error.message,
      code: err.code,
      requestId: req.headers['x-request-id'] || null,
    });
  }

  // Error genérico
  return res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    code: 'INTERNAL_SERVER_ERROR',
    requestId: req.headers['x-request-id'] || null,
  });
}
