// src/routes/auth.ts

import { Router } from 'express';
import { signup, login, resetPassword } from '../controllers/auth.js';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/reset-password', resetPassword);

export default router;