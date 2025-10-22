// src/controllers/lead.ts

import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead.js';
import { Listing } from '../models/Listing.js';
import { User, IUser } from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import { sendNewLeadNotification } from '../services/email.js';
import { Types } from 'mongoose';

// Extend the Express Request type for lead-specific routes
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

/**
 * Create a new lead from a buyer's inquiry
 * @route POST /api/leads
 * @access Public
 */
export const createLead = catchAsync(async (
  req: Request<{}, {}, CreateLeadBody>,
  res: Response,
  next: NextFunction
) => {
    const { listingId, name, email, phone, message } = req.body;

    if (!listingId || !name || !email || !message) {
        return res.status(400).json({ status: 'fail', message: 'Missing required lead information.' });
    }

    // 1. Find the listing and its agent
    const listing = await Listing.findById(listingId).select('agent status title');
    if (!listing || listing.status !== 'Active') {
        return res.status(404).json({ 
            status: 'fail', 
            message: 'Listing not found or is not active.' 
        });
    }

    const agent = await User.findById(listing.agent).select('email');
    if (!agent) {
        console.error(`Agent not found for listing ID: ${listingId}`);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Could not identify listing agent.' 
        });
    }

    // 2. Create the Lead record in the database
    const newLead = await Lead.create({
        listing: listingId,
        name,
        email,
        phone,
        message,
        status: 'New',
    });

    // 3. Increment the lead count
    await Listing.findByIdAndUpdate(listingId, { 
        $inc: { leadsCount: 1 } 
    }); 

    // 4. Send Email Notification to the Agent (non-blocking)
    try {
        await sendNewLeadNotification(agent.email, listing.title || 'New Property Listing', { 
            name, 
            email, 
            phone: phone || 'Not provided', 
            message 
        });
    } catch (emailError) {
        console.error('Lead created, but failed to send email:', emailError);
        // Do not return error 500 to the user, as the lead was captured successfully.
    }
    
    // 5. Respond to the client
    res.status(201).json({
        status: 'success',
        data: {
            lead: {
                id: newLead._id,
                listing: newLead.listing,
                name: newLead.name,
                email: newLead.email,
                phone: newLead.phone,
                status: newLead.status,
                createdAt: newLead.createdAt
            }
        }
    });
});

/**
 * GET /api/leads/mylistings
 * Requires: Agent role
 * Retrieves all leads for the authenticated Agent's listings.
 */
/**
 * Get all leads for the authenticated agent's listings
 * @route GET /api/leads/mylistings
 * @access Private/Agent
 */
export const getAgentLeads = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Find all listings belonging to the authenticated user
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }
    
    const agentListings = await Listing.find({ agent: req.user._id }).select('_id title');
    
    const listingIds = agentListings.map(listing => listing._id);

    // 2. Find all leads associated with those listings
    const leads = await Lead.find({ listing: { $in: listingIds } })
        .populate('listing', 'title price') // Populate listing details for context
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: leads.length,
        data: { leads },
    });
});

/**
 * PATCH /api/leads/:id
 * Requires: Agent/Admin role (to update status)
 * Updates the status of a specific lead (e.g., from New to Contacted).
 */
/**
 * Update lead status
 * @route PATCH /api/leads/:id
 * @access Private/Agent,Admin
 */
export const updateLeadStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const leadId = req.params.id;
    const { status } = req.body;

    if (!status || !['New', 'Contacted', 'Converted', 'Closed'].includes(status)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid lead status.' });
    }

    // 1. Find the lead and the associated listing
    const lead = await Lead.findById(leadId).populate('listing');
    if (!lead || !lead.listing) {
        return res.status(404).json({ status: 'fail', message: 'Lead not found.' });
    }

    const listing = lead.listing as any; 

    // 2. Authorization Check: Agent must be the owner of the listing, or user must be Admin
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }

    const isOwner = listing.agent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';
    
    if (!isOwner && !isAdmin) {
        return res.status(403).json({ status: 'fail', message: 'You do not have permission to update this lead.' });
    }

    // 3. Update the status
    lead.status = status;
    await lead.save();

    res.status(200).json({
        status: 'success',
        data: { lead },
    });
});