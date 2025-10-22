// src/routes/lead.ts

import { Router, Request, Response, NextFunction } from 'express';
import { createLead, getAgentLeads, updateLeadStatus } from '../controllers/lead.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { Types } from 'mongoose';
import { IUser } from '../models/User.js';

// Extend the Express Request type for lead routes
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser & { _id: Types.ObjectId };
  }
}

// Type for the create lead request body
interface CreateLeadBody {
  listingId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Type for the update status request body
interface UpdateStatusBody {
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
}

const router = Router();

/**
 * @route   POST /api/leads
 * @desc    Create a new lead from buyer inquiry
 * @access  Public
 */
router.post<{}, {}, CreateLeadBody>('/', createLead);

// Protect all routes after this middleware
router.use(protect);

/**
 * @route   GET /api/leads/mylistings
 * @desc    Get all leads for agent's listings
 * @access  Private/Agent
 */
router.get('/mylistings', restrictTo('Agent'), getAgentLeads);

/**
 * @route   PATCH /api/leads/:id
 * @desc    Update lead status
 * @access  Private/Agent,Admin
 */
router.patch<{ id: string }, {}, UpdateStatusBody>(
  '/:id', 
  restrictTo('Agent', 'Admin'), 
  updateLeadStatus
);

export default router;