import { Request } from 'express';

export function parsePagination(req: Request, defaultLimit = 50, maxLimit = 100) {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(req.query.limit as string, 10) || defaultLimit)
  );

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
