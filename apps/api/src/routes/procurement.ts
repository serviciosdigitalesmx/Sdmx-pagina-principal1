import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { getProcurementSummary, getProcurementSuggestions } from '../controllers/procurement';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(attachScope);
router.use(requireTenantBillingActive);

router.get('/summary', requireRole('owner', 'manager'), getProcurementSummary);
router.get('/suggestions', requireRole('owner', 'manager'), getProcurementSuggestions);

export default router;
