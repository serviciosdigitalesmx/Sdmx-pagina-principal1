import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { requireFinanceScope } from '../middleware/financeScope';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { createExpense, deleteExpense, getBalance, getCashflow, getExpense } from '../controllers/finance';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/balance', requireTenantModule('finance'), requireRole('owner'), getBalance);
router.get('/cashflow/:sucursalId', requireTenantModule('finance'), requireRole('owner', 'manager'), requireFinanceScope, getCashflow);
router.post('/expense', requireTenantModule('expenses'), requireRole('owner', 'manager'), requireFinanceScope, createExpense);
router.get('/expense/:id', requireTenantModule('expenses'), requireRole('owner', 'manager'), getExpense);
router.delete('/expense/:id', requireTenantModule('expenses'), requireRole('owner', 'manager'), deleteExpense);

export default router;
