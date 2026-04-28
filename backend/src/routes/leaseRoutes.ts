import express from 'express';
import {
  createLease,
  getLeases,
  getLeaseById,
  updateLease,
} from '../controllers/leaseController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(restrictTo('Admin', 'Manager', 'Owner'), getLeases)
  .post(restrictTo('Admin', 'Manager', 'Owner'), createLease);

router
  .route('/:id')
  .get(getLeaseById)
  .put(restrictTo('Admin', 'Manager', 'Owner'), updateLease);

export default router;
