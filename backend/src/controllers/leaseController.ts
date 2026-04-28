import { Request, Response, NextFunction } from 'express';
import { Lease } from '../models/Lease.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * @desc    Create a new lease
 * @route   POST /api/leases
 * @access  Private (Admin/Manager)
 */
export const createLease = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lease = await Lease.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      lease,
    },
  });
});

/**
 * @desc    Get all leases with filters
 * @route   GET /api/leases
 * @access  Private (Admin/Manager)
 */
export const getLeases = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status, property, tenant } = req.query;
  const filter: any = {};

  if (status) filter.leaseStatus = status;
  if (property) filter.propertyId = property;
  if (tenant) filter.tenantId = tenant;

  const leases = await Lease.find(filter)
    .populate('propertyId', 'title address')
    .populate('tenantId', 'firstName lastName email')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: leases.length,
    data: {
      leases,
    },
  });
});

/**
 * @desc    Get single lease by ID
 * @route   GET /api/leases/:id
 * @access  Private
 */
export const getLeaseById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lease = await Lease.findById(req.params.id)
    .populate('propertyId')
    .populate('tenantId', 'firstName lastName email phone');

  if (!lease) {
    return res.status(404).json({
      status: 'fail',
      message: 'Lease not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      lease,
    },
  });
});

/**
 * @desc    Update lease
 * @route   PUT /api/leases/:id
 * @access  Private (Admin/Manager)
 */
export const updateLease = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const lease = await Lease.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lease) {
    return res.status(404).json({
      status: 'fail',
      message: 'Lease not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      lease,
    },
  });
});
