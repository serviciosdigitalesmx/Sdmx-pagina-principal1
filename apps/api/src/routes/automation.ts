import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import {
  getRules, createRule, updateRule,
  getTemplates, createTemplate,
  getLogs
} from '../controllers/automation';

const router = Router();

router.use(requireAuth);
router.use(requireTenantBillingActive);

router.get('/rules', getRules);
router.post('/rules', createRule);
router.put('/rules/:id', updateRule);

router.get('/templates', getTemplates);
router.post('/templates', createTemplate);

router.get('/logs', getLogs);

export default router;
