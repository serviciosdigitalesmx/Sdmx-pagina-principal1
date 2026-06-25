import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

const MAX_REQUEST_ID_LENGTH = 128;
const SAFE_REQUEST_ID_PATTERN = /^[a-zA-Z0-9._:-]+$/;

export function normalizeRequestId(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, MAX_REQUEST_ID_LENGTH);
  if (!trimmed || !SAFE_REQUEST_ID_PATTERN.test(trimmed)) return null;
  return trimmed;
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.get('x-request-id') ?? req.get('x-correlation-id');
  const requestId = normalizeRequestId(incoming) ?? randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
}
