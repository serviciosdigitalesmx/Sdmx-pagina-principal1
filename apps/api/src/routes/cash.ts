import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import {
  getRegisters,
  createRegister,
  openShift,
  getActiveShift,
  closeShift,
  createSale,
  createExpense,
  getShiftDetails
} from '../controllers/cash';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(attachScope);
router.use(requireTenantBillingActive);

router.get('/registers', getRegisters);
router.post('/registers', createRegister);
router.post('/shifts/open', openShift);
router.get('/shifts/active', getActiveShift);
router.post('/shifts/close', closeShift);
router.post('/sales', createSale);
router.post('/expenses', createExpense);
router.get('/shifts/:shiftId', getShiftDetails);

export default router;
