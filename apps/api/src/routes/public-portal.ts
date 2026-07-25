import { Router } from 'express';
import { getPublicOrderDetails, authorizeOrder, createPublicOrderPayment } from '../controllers/public-portal';

const router = Router();

// Note: No authentication middleware here since these are public endpoints
router.get('/order/:publicToken', getPublicOrderDetails);
router.post('/order/:publicToken/authorize', authorizeOrder);
router.post('/order/:publicToken/payment', createPublicOrderPayment);

export default router;
