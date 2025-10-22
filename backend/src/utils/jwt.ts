// src/utils/jwt.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { IUser } from '../models/User.js';

// Define the shape of the token payload
export interface TokenPayload {
  id: string;
  email: string;
  role: IUser['role'];
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

// Generate a JWT
export const signToken = (user: any): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  // Create payload with required fields
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  // Sign and return the token with proper type assertion
  return jwt.sign(
    payload,
    secret,
    { expiresIn } as SignOptions
  );
};