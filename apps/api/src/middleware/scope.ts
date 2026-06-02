import { Request, Response, NextFunction } from 'express';
import { resolveScope } from '../lib/resolve-scope';

export const attachScope = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.scope = resolveScope(req, req.user);
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to resolve scope';
    return res.status(400).json({ error: message });
  }
};
