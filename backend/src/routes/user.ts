// src/routes/user.ts

import express from 'express';
import { getProfile, updateProfile, getAllUsers, deleteUser, toggleSavedProperty, getSavedProperties } from '../controllers/user.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes after this middleware are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Buyer / All User Property Saving
router.post('/save/:propId', toggleSavedProperty);
router.get('/saved-properties', getSavedProperties);

// Admin only routes
router.use(restrictTo('Admin'));
router.get('/admin/users', getAllUsers);
router.delete('/admin/users/:id', deleteUser);

export default router;
