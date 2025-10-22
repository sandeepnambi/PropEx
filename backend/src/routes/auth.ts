// src/routes/auth.ts

import { Router } from 'express';
import { signup, login } from '../controllers/auth.js';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

export default router;