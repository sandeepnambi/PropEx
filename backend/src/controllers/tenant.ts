// backend/src/controllers/tenant.ts

import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../models/Tenant.js';
import { User, IUser } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import catchAsync from '../utils/catchAsync.js';
import { Types } from 'mongoose';

// Extend Request to include user (already declared in listing.ts via module augmentation)
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser & { _id: Types.ObjectId };
  }
}

// ===================================
// 1. ASSIGN TENANT TO PROPERTY
// POST /api/tenants
// Access: Manager, Owner, Admin
// ===================================
export const assignTenant = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tenantEmail, propertyId, leaseStart, leaseEnd, rentAmount, notes } = req.body;

  // 1. Validate required fields
  if (!tenantEmail || !propertyId || !leaseStart || !leaseEnd || !rentAmount) {
    return res.status(400).json({
      status: 'fail',
      message: 'tenantEmail, propertyId, leaseStart, leaseEnd, and rentAmount are all required.',
    });
  }

  // 2. Find the tenant user by email and ensure they have the 'Tenant' role
  const tenantUser = await User.findOne({ email: tenantEmail.toLowerCase() });
  if (!tenantUser) {
    return res.status(404).json({ status: 'fail', message: `No user found with email: ${tenantEmail}` });
  }
  if (tenantUser.role !== 'Tenant' && tenantUser.role !== 'Buyer') {
    return res.status(400).json({
      status: 'fail',
      message: `User "${tenantEmail}" has role "${tenantUser.role}". Only users with the "Tenant" or "Buyer" role can be assigned as tenants.`,
    });
  }

  // 3. Verify the property exists
  const property = await Listing.findById(propertyId);
  if (!property) {
    return res.status(404).json({ status: 'fail', message: 'Property not found.' });
  }

  // 4. Check for existing active tenancy on this property
  const existingActiveTenancy = await Tenant.findOne({ property: propertyId, status: 'Active' });
  if (existingActiveTenancy) {
    return res.status(409).json({
      status: 'fail',
      message: 'This property already has an active tenant. Please terminate or expire the existing tenancy first.',
    });
  }

  // 5. Validate lease dates
  const start = new Date(leaseStart);
  const end = new Date(leaseEnd);
  if (end <= start) {
    return res.status(400).json({ status: 'fail', message: 'Lease end date must be after lease start date.' });
  }

  // 6. Create the tenancy record
  const newTenancy = await Tenant.create({
    tenant: tenantUser._id,
    property: propertyId,
    leaseStart: start,
    leaseEnd: end,
    rentAmount: Number(rentAmount),
    status: 'Active',
    notes: notes || '',
  });

  // 7. Populate for response
  const populated = await Tenant.findById(newTenancy._id)
    .populate('tenant', 'firstName lastName email phone')
    .populate('property', 'title address city state');

  res.status(201).json({
    status: 'success',
    message: 'Tenant successfully assigned to property.',
    data: { tenancy: populated },
  });
});

// ===================================
// 2. UPDATE TENANCY STATUS (Terminate/Expire)
// PATCH /api/tenants/:id
// Access: Manager, Owner, Admin
// ===================================
export const updateTenancyStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['Active', 'Expired', 'Terminated'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      status: 'fail',
      message: `Status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const tenancy = await Tenant.findById(id);
  if (!tenancy) {
    return res.status(404).json({ status: 'fail', message: 'Tenancy record not found.' });
  }

  tenancy.status = status;
  if (notes) tenancy.notes = notes;
  await tenancy.save();

  const populated = await Tenant.findById(id)
    .populate('tenant', 'firstName lastName email phone')
    .populate('property', 'title address city state');

  res.status(200).json({
    status: 'success',
    message: `Tenancy status updated to "${status}".`,
    data: { tenancy: populated },
  });
});

// ===================================
// 3. REMOVE / DELETE A TENANCY RECORD
// DELETE /api/tenants/:id
// Access: Admin only
// ===================================
export const removeTenancy = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const tenancy = await Tenant.findByIdAndDelete(id);
  if (!tenancy) {
    return res.status(404).json({ status: 'fail', message: 'Tenancy record not found.' });
  }

  res.status(204).json({ status: 'success', data: null });
});

// ===================================
// 4. GET CURRENT (ACTIVE) TENANTS FOR A PROPERTY
// GET /api/tenants/property/:propertyId
// Access: Manager, Owner, Admin
// ===================================
export const getPropertyTenants = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { propertyId } = req.params;

  const tenancies = await Tenant.find({ property: propertyId, status: 'Active' })
    .populate('tenant', 'firstName lastName email phone')
    .populate('property', 'title address city state')
    .sort({ leaseStart: -1 });

  res.status(200).json({
    status: 'success',
    results: tenancies.length,
    data: { tenancies },
  });
});

// ===================================
// 5. GET FULL TENANT HISTORY FOR A PROPERTY
// GET /api/tenants/property/:propertyId/history
// Access: Manager, Owner, Admin
// ===================================
export const getTenantHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { propertyId } = req.params;

  const history = await Tenant.find({ property: propertyId })
    .populate('tenant', 'firstName lastName email phone')
    .populate('property', 'title address city state')
    .sort({ leaseStart: -1 }); // Most recent first

  res.status(200).json({
    status: 'success',
    results: history.length,
    data: { history },
  });
});

// ===================================
// 6. TENANT: GET MY OWN LEASE
// GET /api/tenants/my-lease
// Access: Tenant only
// ===================================
export const getMyLease = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ status: 'fail', message: 'Authentication required.' });
  }

  const tenancy = await Tenant.findOne({ tenant: req.user._id, status: 'Active' })
    .populate('tenant', 'firstName lastName email phone')
    .populate('property', 'title address city state zipCode price images agent')
    .sort({ leaseStart: -1 });

  if (!tenancy) {
    return res.status(404).json({
      status: 'fail',
      message: 'No active lease found for your account.',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tenancy },
  });
});

// 7. ADMIN/MANAGER/OWNER: GET ALL TENANCIES
// GET /api/tenants
// Access: Admin, Manager, Owner
// ===================================
export const getAllTenancies = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.query;

  const filter: Record<string, unknown> = {};
  if (status && ['Active', 'Expired', 'Terminated'].includes(status as string)) {
    filter.status = status;
  }

  // If not admin, restrict to properties managed by this user
  if (req.user?.role !== 'Admin') {
    const myProperties = await Listing.find({ agent: req.user?._id }).select('_id');
    const propertyIds = myProperties.map(p => p._id);
    filter.property = { $in: propertyIds };
  }

  const tenancies = await Tenant.find(filter)
    .populate('tenant', 'firstName lastName email phone')
    .populate('property', 'title address city state')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: tenancies.length,
    data: { tenancies },
  });
});
