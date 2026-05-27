import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { createSupplier, deleteSupplier, getSupplierById, listSuppliers, updateSupplier } from '../controllers/suppliers';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/', requireTenantModule('suppliers'), requireRole('owner', 'manager'), listSuppliers);
router.post('/', requireTenantModule('suppliers'), requireRole('owner', 'manager'), createSupplier);
router.get('/:id', requireTenantModule('suppliers'), requireRole('owner', 'manager'), getSupplierById);
router.put('/:id', requireTenantModule('suppliers'), requireRole('owner', 'manager'), updateSupplier);
router.delete('/:id', requireTenantModule('suppliers'), requireRole('owner', 'manager'), deleteSupplier);

export default router;
