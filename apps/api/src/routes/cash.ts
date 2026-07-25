import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import {
  getRegisters,
  openShift,
  getActiveShift,
  closeShift,
  createSale,
  createExpense,
  getShiftDetails
} from '../controllers/cash';

const router = Router();

router.use(requireAuth);
router.use(requireTenantBillingActive);

router.get('/registers', getRegisters);
router.post('/shifts/open', openShift);
router.get('/shifts/active', getActiveShift);
router.post('/shifts/close', closeShift);
router.post('/sales', createSale);
router.post('/expenses', createExpense);
router.get('/shifts/:shiftId', getShiftDetails);

export default router;
