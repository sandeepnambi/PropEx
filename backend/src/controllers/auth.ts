// src/controllers/auth.ts

import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import { signToken } from '../utils/jwt.js';

// Helper function to send JWT token in response
const sendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user);

  // Remove password from output (if it was selected)
  if (user.password) {
    user.password = undefined;
  }

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/**
 * POST /api/auth/signup
 * Handles user registration (Buyer and Agent)
 */
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  // Basic validation (more robust validation should be done with a library like Zod or Joi)
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ status: 'fail', message: 'Missing required fields.' });
  }

  // Determine role, default to 'Buyer'. Agents/Admins should be manually promoted later or via a secret code.
  const finalRole = role && role === 'Agent' ? 'Agent' : 'Buyer';

  const newUser = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: finalRole,
  });

  sendToken(newUser, 201, res);
});

/**
 * POST /api/auth/login
 * Handles user authentication
 */
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({ status: 'fail', message: 'Please provide email and password!' });
  }

  // 2) Check if user exists AND password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
  }

  // 3) If everything is ok, send token to client
  sendToken(user, 200, res);
});