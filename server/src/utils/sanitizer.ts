/**
 * Utilidades de Sanitización y Validación
 */

export function sanitizeString(val: any, maxLength = 1000): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLength);
}

export function sanitizeNumber(val: any): number {
  const n = Number(val);
  return isFinite(n) ? n : 0;
}

export function sanitizeBoolean(val: any): boolean {
  return !!val;
}

export function sanitizeDate(val: any): string | null {
  if (!val) return null;
  const d = new Date(val);
  return isFinite(d.getTime()) ? d.toISOString() : null;
}

export function validateRequired(payload: any, fields: string[]): string | null {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
      return `El campo '${field}' es requerido`;
    }
  }
  return null;
}
