import { Router } from 'express';
import { getExportData, getExportSummary, previewImport } from '../controllers/portability';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validateTenant } from '../middleware/validateTenant';

const exportRouter = Router({ mergeParams: true });
const importRouter = Router({ mergeParams: true });

exportRouter.use(requireAuth);
exportRouter.use(validateTenant);
exportRouter.use(requireRole('owner', 'manager'));
exportRouter.get('/summary', getExportSummary);
exportRouter.get('/data', getExportData);

importRouter.use(requireAuth);
importRouter.use(validateTenant);
importRouter.use(requireRole('owner', 'manager'));
importRouter.post('/preview', previewImport);

export { exportRouter as portabilityExportRouter, importRouter as portabilityImportRouter };
