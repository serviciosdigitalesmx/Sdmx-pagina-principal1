import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { safeLogError } from '../services/observability';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500;
  const timestamp = new Date().toISOString();
  const requestId = req.requestId ?? randomUUID();
  const message = statusCode >= 500 ? 'Error interno del servidor' : err.message || 'Error de solicitud';

  if (!req.requestId) {
    req.requestId = requestId;
  }
  res.setHeader('x-request-id', requestId);

  safeLogError('API_UNHANDLED_ERROR', {
    requestId,
    method: req.method,
    path: req.originalUrl ?? req.url,
    statusCode,
    message: err.message || 'Unhandled error',
    error: err,
  });

  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp,
    requestId,
  });
};
