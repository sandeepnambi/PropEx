// src/middleware/auth.js

import { User } from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

/**
 * 1. Protect Middleware: Checks for and verifies the JWT.
 */
export const protect = catchAsync(async (req, res, next) => {
  let token = '';

  // 1) Check if the token exists in the headers (Bearer token)
  const authHeader = req.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1] || '';
  }

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
  }

  // 2) Verification of the token
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ status: 'error', message: 'Server configuration error.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token. Please log in again.' });
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+role');

  if (!currentUser) {
    return res.status(401).json({ status: 'fail', message: 'The user belonging to this token no longer exists.' });
  }

  // Ensure user has a valid role
  if (!currentUser.role) {
    return res.status(403).json({ status: 'fail', message: 'User role is not defined.' });
  }

  // 4) Grant access to protected route
  req.user = currentUser;
  next();
});

/**
 * 2. Restrict To Middleware: Restricts access to specific roles.
 * @param roles Array of allowed roles (e.g., ['Admin', 'Manager'])
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};
