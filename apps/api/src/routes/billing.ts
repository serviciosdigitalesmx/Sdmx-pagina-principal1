import { Router } from 'express';
import { createCheckout, getBillingStatus, mercadopagoWebhook, createPublicCheckout } from '../controllers/billing';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { requireRole } from '../middleware/requireRole';

const router = Router({ mergeParams: true });

// Public checkout endpoint for customer-initiated purchases (tenantSlug must be provided)
router.post('/checkout', createPublicCheckout);

// Protected checkout for admin users
router.post('/checkout/protected', requireAuth, validateTenant, attachScope, requireRole('owner', 'manager'), createCheckout);
router.get('/status', requireAuth, validateTenant, attachScope, requireRole('owner', 'manager'), getBillingStatus);

export default router;

export const webhookRouter = Router({ mergeParams: true });
webhookRouter.post('/mercadopago', mercadopagoWebhook);
