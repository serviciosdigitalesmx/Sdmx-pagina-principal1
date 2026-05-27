import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  listPurchaseOrders,
  receivePurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
} from '../controllers/purchase-orders';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/', requireTenantModule('purchase-orders'), requireRole('owner', 'manager'), listPurchaseOrders);
router.post('/', requireTenantModule('purchase-orders'), requireRole('owner', 'manager'), createPurchaseOrder);
router.get('/:id', requireTenantModule('purchase-orders'), requireRole('owner', 'manager'), getPurchaseOrderById);
router.put('/:id', requireTenantModule('purchase-orders'), requireRole('owner', 'manager'), updatePurchaseOrder);
router.patch('/:id/status', requireTenantModule('purchase-orders'), requireRole('owner', 'manager'), updatePurchaseOrderStatus);
router.post('/:id/receive', requireTenantModule('purchase-orders'), requireRole('owner', 'manager'), receivePurchaseOrder);
router.delete('/:id', requireTenantModule('purchase-orders'), requireRole('owner', 'manager'), deletePurchaseOrder);

export default router;
