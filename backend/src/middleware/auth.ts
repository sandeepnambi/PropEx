// src/middleware/auth.ts

import { User, IUser } from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import { TokenPayload } from '../utils/jwt.js';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Extend the Express Request type to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser & { _id: Types.ObjectId };
  }
}

/**
 * 1. Protect Middleware: Checks for and verifies the JWT.
 */
export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token = '';

  // 1) Check if the token exists in the headers (Bearer token)
  const authHeader = req.headers.authorization;
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

  // Define the expected JWT payload structure
  interface JwtPayload {
    id: string;
    role: 'User' | 'Agent' | 'Admin';
    iat?: number;
    exp?: number;
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, secret) as JwtPayload & TokenPayload;
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token. Please log in again.' });
  }

  // Removed duplicate try-catch block

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
  // Type assertion is safe here because we've already checked currentUser exists and has a role
  req.user = currentUser as unknown as IUser & { _id: Types.ObjectId };
  next();
});

/**
 * 2. Restrict To Middleware: Restricts access to specific roles.
 * @param roles Array of allowed roles (e.g., ['Admin', 'Agent'])
 */
export const restrictTo = (...roles: IUser['role'][]): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
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