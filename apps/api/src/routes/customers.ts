import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { createCustomer, listCustomers } from '../controllers/catalogs';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/', requireTenantModule('customers'), requireRole('owner', 'manager', 'technician'), listCustomers);
router.post('/', requireTenantModule('customers'), requireRole('owner', 'manager'), createCustomer);

export default router;
