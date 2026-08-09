import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { searchOmni } from '../controllers/search';

const router = Router();

router.use(requireAuth);
router.use(validateTenant);
router.use(attachScope);
router.use(requireTenantBillingActive);

router.get('/', searchOmni);

export default router;
