import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { getSecuritySummary } from '../controllers/suppliers';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(attachTenantCapabilities);

router.get('/summary', requireTenantModule('security'), getSecuritySummary);

export default router;
