import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { listBranches } from '../controllers/branches';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/', requireTenantModule('branches'), requireRole('owner', 'manager', 'technician'), listBranches);

export default router;
