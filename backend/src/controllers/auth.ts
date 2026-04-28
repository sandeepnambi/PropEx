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

  // Define valid roles for public registration
  const validRoles = ['Buyer', 'Tenant', 'Manager', 'Owner'];
  
  // Use provided role if valid, otherwise default to 'Buyer'
  // Admin role is excluded from public registration for security
  const finalRole = role && validRoles.includes(role) ? role : 'Buyer';

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

/**
 * POST /api/auth/reset-password
 * Simple password reset for demo purposes
 */
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ status: 'fail', message: 'Please provide email and new password' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ status: 'fail', message: 'No user found with that email address' });
  }

  // Update password - will be hashed by pre-save hook
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully!'
  });
});