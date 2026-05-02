import { Router } from 'express';
import { getManagementAnalytics } from '../controllers/analytics.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/management', restrictTo('Manager', 'Owner', 'Admin'), getManagementAnalytics);

export default router;
