import { Request, Response, NextFunction } from 'express';
import { Listing, IListing } from '../models/Listing.js';
import { User, IUser } from '../models/User.js';
import { uploadImage, deleteImage } from '../services/cloudinary.js';
import catchAsync from '../utils/catchAsync.js';
import { Types } from 'mongoose';

// Extend the Express Request type for listing routes
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser & { _id: Types.ObjectId };
  }
}

/**
 * @desc    Get all listings for the currently logged-in agent
 * @route   GET /api/listings/agent/my-listings
 * @access  Private/Agent
 */
export const getAgentListings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Get the agent ID from the authenticated user
  const agentId = req.user?._id;

  if (!agentId) {
    return next(new Error('No agent ID found in request'));
  }

  // Find all listings where the agent field matches the current user's ID
  const listings = await Listing.find({ agent: agentId })
    .sort({ createdAt: -1 }) // Sort by newest first
    .populate('agent', 'firstName lastName email phone'); // Populate agent details

  res.status(200).json({
    status: 'success',
    results: listings.length,
    data: {
      listings
    }
  });
});

/**
 * Utility to process image uploads from the request (using Multer processing)
 */
const handleImageUploads = async (req: Request): Promise<IListing['images']> => {
    const images: IListing['images'] = [];
    
    // Ensure req.files is properly typed and exists
    if (!req.files || !Array.isArray(req.files)) {
        return images;
    }

    const files = req.files as Express.Multer.File[];

    for (const [index, file] of files.entries()) {
        try {
            if (!file.mimetype || !file.buffer) {
                console.warn('Skipping invalid file upload');
                continue;
            }
            
            // Convert file buffer to a data URI string for Cloudinary upload
            const fileData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const uploadedImage = await uploadImage(fileData, 'listings');
            
            if (uploadedImage) {
                images.push({
                    ...uploadedImage,
                    orderIndex: index,
                    altText: `${req.body?.title || 'Property'} - Photo ${index + 1}`
                });
            }
        } catch (error) {
            console.error('Error processing image upload:', error);
            // Continue with other images even if one fails
        }
    }
    return images;
};


// ===================================
// CRUD Operations (Protected: Agent/Admin)
// ===================================

/**
 * POST /api/listings
 * Creates a new property listing and uploads images to Cloudinary.
 */
export const createListing = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    // 1. Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }

    // 2. Initial Listing creation (excluding images initially for simplicity)
    const newListing = await Listing.create({
        ...req.body,
        agent: req.user._id, // Set the agent ID from the authenticated user
        status: 'Draft', // Start as Draft
        images: [] // Initialize with empty images array
    });

    // 2. Handle Image Uploads
    try {
        const images = await handleImageUploads(req);
        if (images.length > 0) {
            newListing.images = images;
            // Save the updated listing with image URLs/IDs
            await newListing.save();
        }
    } catch (error) {
        // If image upload fails, delete the created listing
        await Listing.findByIdAndDelete(newListing._id);
        throw error; // This will be caught by catchAsync
    }

    res.status(201).json({
        status: 'success',
        data: {
            listing: newListing,
        },
    });
});

/**
 * PATCH /api/listings/:id
 * Updates listing details (only owner or Admin).
 */
export const updateListing = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const listingId = req.params.id;
    const updates = { ...req.body };

    // 1. Find the existing listing
    const listing = await Listing.findById(listingId);

    if (!listing) {
        return res.status(404).json({ status: 'fail', message: 'No listing found with that ID.' });
    }

    // 2. Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }

    // 3. Authorization Check: Agent must be the owner or user must be Admin
    const isOwner = listing.agent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';
    
    if (!isOwner && !isAdmin) {
        return res.status(403).json({ status: 'fail', message: 'You do not have permission to update this listing.' });
    }

    // 3. Handle new image uploads (if files are present)
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const newImages = await handleImageUploads(req);
        // Append new images to existing ones
        updates.images = [...(listing.images || []), ...newImages];
    }
    
    // 4. Handle image deletions (if public IDs are passed in the body, e.g., updates.imagesToDelete = ['id1', 'id2'])
    if (updates.imagesToDelete && Array.isArray(updates.imagesToDelete)) {
        for (const publicId of updates.imagesToDelete) {
            await deleteImage(publicId);
        }
        // Filter out deleted images from the listing's images array
        updates.images = listing.images.filter(img => !updates.imagesToDelete.includes(img.cloudinaryId));
        delete updates.imagesToDelete; // Remove custom key from database update
    }

    // 5. Apply updates and save
    const updatedListing = await Listing.findByIdAndUpdate(
        listingId, 
        { $set: updates },
        {
            new: true,
            runValidators: true,
        }
    ).lean();

    res.status(200).json({
        status: 'success',
        data: {
            listing: updatedListing,
        },
    });
});

/**
 * DELETE /api/listings/:id
 * Removes a listing and all associated images from Cloudinary.
 */
export const deleteListing = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
        return res.status(404).json({ status: 'fail', message: 'No listing found with that ID to delete.' });
    }

    // 1. Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required'
      });
    }

    // 2. Authorization Check (same as update)
    const isOwner = listing.agent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ status: 'fail', message: 'You do not have permission to delete this listing.' });
    }

    // 1. Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
        await Promise.allSettled(
            listing.images.map(image => 
                deleteImage(image.cloudinaryId).catch(error => 
                    console.error(`Failed to delete image ${image.cloudinaryId}:`, error)
                )
            )
        );
    }

    // 2. Delete listing from DB
    await Listing.findByIdAndDelete(listingId);

    res.status(204).json({
        status: 'success',
        data: null, // 204 No Content response
    });
});


// ===================================
// READ Operations (Public/Search)
// ===================================

/**
 * GET /api/listings
 * Public access. Implements search, filtering, and pagination.
 */
export const getAllListings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Build Query Object from request query parameters
    const queryObject: any = { status: 'Active' }; // Only show active listings

    // Filtering (price, beds, baths, type)
    if (req.query.priceMin || req.query.priceMax) {
        queryObject.price = {};
        if (req.query.priceMin) {
            queryObject.price.$gte = Number(req.query.priceMin);
        }
        if (req.query.priceMax) {
            queryObject.price.$lte = Number(req.query.priceMax);
        }
    }
    
    if (req.query.beds) queryObject.bedrooms = { $gte: Number(req.query.beds) };
    if (req.query.baths) queryObject.bathrooms = { $gte: Number(req.query.baths) };
    if (req.query.propertyType) queryObject.propertyType = req.query.propertyType;


    // Search (Keyword + Location)
    if (req.query.keyword) {
        const searchRegex = new RegExp(req.query.keyword as string, 'i');
        // Use $or to search across multiple text fields
        queryObject.$or = [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { city: { $regex: searchRegex } },
        ];
    }
    
    // Pagination & Sorting
    const limit = Math.min(Number(req.query.limit) || 10, 100); // Max 100 items per page
    const skip = Math.max(Number(req.query.skip) || 0, 0);
    
    // Define allowed sort fields and their default sort order
    const allowedSortFields = ['price', 'createdAt', 'viewsCount', 'bedrooms', 'bathrooms'];
    const defaultSort = { createdAt: -1 }; // Newest first by default
    
    // Parse and validate sort parameter
    let sortOptions: { [key: string]: 1 | -1 } = defaultSort as { [key: string]: 1 | -1 };
    
    if (req.query.sort && typeof req.query.sort === 'string') {
        const sortField = req.query.sort.startsWith('-') 
            ? req.query.sort.substring(1) 
            : req.query.sort;
        const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
        
        if (allowedSortFields.includes(sortField)) {
            sortOptions = { [sortField]: sortOrder } as const;
        }
    }

    // 2. Execute Query
    const listings = await Listing.find(queryObject)
        .populate('agent', 'firstName lastName phone email')
        .sort(sortOptions)
        .limit(limit)
        .skip(skip);

    // 3. Send Response
    res.status(200).json({
        status: 'success',
        results: listings.length,
        data: {
            listings,
        },
    });
});


/**
 * GET /api/listings/:id
 * Public access. Retrieves a single listing and increments view count.
 */
export const getListingById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Find listing AND atomically increment viewsCount (Simple Analytics: Views)
    const listing = await Listing.findOneAndUpdate(
        { _id: req.params.id, status: 'Active' }, // Only show Active listings
        { $inc: { viewsCount: 1 } },
        { new: true } // Return the updated document
    ).populate('agent', 'firstName lastName phone email');

    if (!listing) {
        return res.status(404).json({ status: 'fail', message: 'No active listing found with that ID.' });
    }

    res.status(200).json({
        status: 'success',
        data: {
            listing,
        },
    });
});