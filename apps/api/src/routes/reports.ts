import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { getProductivityReport, getReportsSummary } from '../controllers/reports';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(attachScope);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/summary', requireTenantModule('reports'), requireRole('owner', 'manager'), getReportsSummary);
router.get('/productivity', requireTenantModule('reports'), requireRole('owner', 'manager'), getProductivityReport);

export default router;
