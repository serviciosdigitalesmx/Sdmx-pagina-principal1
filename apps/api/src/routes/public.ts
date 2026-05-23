import { Router } from 'express';
import { createPublicQuote, getPublicPortalOrder, getPublicTenantLanding, trackPublicOrder } from '../controllers/public';

const router = Router({ mergeParams: true });

router.post('/quotes', createPublicQuote);
router.get('/tracking', trackPublicOrder);
router.get('/tenant/:tenantSlug/landing', getPublicTenantLanding);
router.get('/tenant/:tenantSlug/orders/:folio', getPublicPortalOrder);

export default router;
