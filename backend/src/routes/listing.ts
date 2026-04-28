// src/routes/listing.ts

import { Router } from 'express';
import { 
    createListing, 
    getAllListings, 
    getListingById, 
    updateListing, 
    deleteListing,
    getAgentListings,
    getAdminListings 
} from '../controllers/listing.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { uploadListingImages } from '../middleware/multer.js'; // Import Multer config

const router = Router();

// ===================================
// 1. PUBLIC ROUTES (Search & Details)
// ===================================

// GET /api/listings: Handles searching and filtering for buyers
router.get('/', getAllListings);

// GET /api/listings/:id: Retrieves a single listing and increments view count
router.get('/:id', getListingById);


// ===================================
// 2. PROTECTED ROUTES (Agent/Admin)
// ===================================

// Apply authentication middleware to all subsequent routes in this file
router.use(protect); 

// GET /api/listings/agent/my-listings: Get all listings for the current agent
router.get('/agent/my-listings', restrictTo('Admin', 'Manager', 'Owner'), getAgentListings); 

// GET /api/listings/admin/moderation: Get all listings for moderation
router.get('/admin/moderation', restrictTo('Admin'), getAdminListings);

router
  .route('/')
  // POST /api/listings: Create a new listing
  .post(
    restrictTo('Admin', 'Manager', 'Owner'), // Only Admins, Managers, and Owners can create listings
    uploadListingImages,         // Middleware to process image files (Multer)
    createListing
  );

router
  .route('/:id')
  // PATCH /api/listings/:id: Update listing details
  .patch(
    restrictTo('Admin', 'Manager', 'Owner'), 
    uploadListingImages,         // Allow image uploads/updates during patch
    updateListing
  )
  // DELETE /api/listings/:id: Remove a listing
  .delete(
    restrictTo('Admin', 'Manager', 'Owner'), 
    deleteListing
  );

export default router;