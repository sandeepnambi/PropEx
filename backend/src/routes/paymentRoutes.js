import { Router } from 'express';
import {
  getAllPayments,
  getMyPayments,
  getPropertyPayments,
  createPayment,
  updatePaymentStatus,
  createCheckoutSession,
} from '../controllers/payment.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);

// Tenant routes
router.get('/my-payments', restrictTo('Tenant', 'Buyer'), getMyPayments);
router.post('/checkout-session/:id', restrictTo('Tenant', 'Buyer'), createCheckoutSession);

// Manager/Admin routes
router.get('/', getAllPayments);
router.get('/property/:propertyId', restrictTo('Manager', 'Owner', 'Admin'), getPropertyPayments);
router.post('/', restrictTo('Manager', 'Owner', 'Admin'), createPayment);
router.patch('/:id', restrictTo('Manager', 'Owner', 'Admin'), updatePaymentStatus);

export default router;
