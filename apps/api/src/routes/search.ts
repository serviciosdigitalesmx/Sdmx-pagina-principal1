import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { searchOmni } from '../controllers/search';

const router = Router();

router.use(requireAuth);
router.use(requireTenantBillingActive);

router.get('/', searchOmni);

export default router;
