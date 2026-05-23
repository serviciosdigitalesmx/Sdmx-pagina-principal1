import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireRole } from '../middleware/requireRole';
import { listBranches } from '../controllers/branches';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);

router.get('/', requireRole('owner', 'manager', 'technician'), listBranches);

export default router;
