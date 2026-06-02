import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { attachScope } from '../middleware/scope';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { requireRole } from '../middleware/requireRole';
import { deactivateUser, getUserPurchaseOrders, inviteUser, listUsers, updateUserRole } from '../controllers/users';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(attachScope);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/', requireTenantModule('users'), requireRole('owner', 'manager'), listUsers);
router.post('/invite', requireTenantModule('users'), requireRole('owner', 'manager'), inviteUser);
router.put('/:id/role', requireTenantModule('users'), requireRole('owner', 'manager'), updateUserRole);
router.delete('/:id', requireTenantModule('users'), requireRole('owner', 'manager'), deactivateUser);
router.get('/:id/purchase-orders', requireTenantModule('users'), requireRole('owner', 'manager'), getUserPurchaseOrders);

export default router;
