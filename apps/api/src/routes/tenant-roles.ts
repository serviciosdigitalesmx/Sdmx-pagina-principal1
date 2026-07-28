import { Router } from 'express';
import { getRolePermissions, updateRolePermissions } from '../controllers/tenant-roles';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { requireRole } from '../middleware/requireRole';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(attachScope);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);
router.use(requireTenantModule('security'));
router.use(requireRole('owner'));

router.get('/permissions', getRolePermissions);
router.post('/permissions', updateRolePermissions);

export default router;
