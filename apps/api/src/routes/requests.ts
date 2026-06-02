import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { convertServiceRequestToOrder, getServiceRequestById, listServiceRequests } from '../controllers/requests';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(attachScope);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/', requireTenantModule('requests'), requireRole('owner', 'manager', 'technician'), listServiceRequests);
router.get('/:id', requireTenantModule('requests'), requireRole('owner', 'manager', 'technician'), getServiceRequestById);
router.post('/:id/convert', requireTenantModule('requests'), requireRole('owner', 'manager'), convertServiceRequestToOrder);

export default router;
