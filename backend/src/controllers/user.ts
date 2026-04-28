// src/controllers/user.ts

import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * GET /api/users/profile
 * Get current user profile
 */
export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * PUT /api/users/profile
 * Update current user profile
 */
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { firstName, lastName, phone },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

/**
 * GET /api/users/admin/users
 * (Admin only) Get all users
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

/**
 * DELETE /api/users/admin/users/:id
 * (Admin only) Delete a user
 */
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'No user found with that ID' });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * POST /api/users/save/:propId
 * Toggle save/unsave a property
 */
export const toggleSavedProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { propId } = req.params;
    const user = await User.findById(req.user?._id);

    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    const listing = await Listing.findById(propId);
    if (!listing) {
        return res.status(404).json({ status: 'fail', message: 'Listing not found' });
    }

    const index = user.savedProperties.indexOf(propId as any);
    if (index === -1) {
        // Save property
        user.savedProperties.push(propId as any);
    } else {
        // Unsave property
        user.savedProperties.splice(index, 1);
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: index === -1 ? 'Property saved' : 'Property removed from saved',
        data: {
            savedProperties: user.savedProperties
        }
    });
});

/**
 * GET /api/users/saved-properties
 * Get all saved properties for current user
 */
export const getSavedProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id).populate('savedProperties');

    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
        status: 'success',
        results: user.savedProperties.length,
        data: {
            savedProperties: user.savedProperties
        }
    });
});
