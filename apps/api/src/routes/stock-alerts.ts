import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireRole } from '../middleware/requireRole';
import { acknowledgeAlert, listAlerts } from '../controllers/stock-alerts';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);

router.get('/', requireRole('owner', 'manager'), listAlerts);
router.patch('/:id/acknowledge', requireRole('owner', 'manager'), acknowledgeAlert);

export default router;
