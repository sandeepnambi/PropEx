// src/routes/lead.js

import { Router } from 'express';
import { createLead, getAgentLeads, updateLeadStatus, getUserInquiries } from '../controllers/lead.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

/**
 * @route   POST /api/leads
 * @desc    Create a new lead from buyer inquiry
 * @access  Public
 */
router.post('/', createLead);

// Protect all routes after this middleware
router.use(protect);

/**
 * @route   GET /api/leads/myinquiries
 * @desc    Get all inquiries made by the authenticated user
 * @access  Private
 */
router.get('/myinquiries', getUserInquiries);

/**
 * @route   GET /api/leads/mylistings
 * @desc    Get all leads for agent's listings
 * @access  Private/Agent
 */
router.get('/mylistings', restrictTo('Manager', 'Admin', 'Owner'), getAgentLeads);

/**
 * @route   PATCH /api/leads/:id
 * @desc    Update lead status
 * @access  Private/Agent,Admin
 */
router.patch(
  '/:id', 
  restrictTo('Manager', 'Admin', 'Owner'), 
  updateLeadStatus
);

export default router;
