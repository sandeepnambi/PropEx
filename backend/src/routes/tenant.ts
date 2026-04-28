// backend/src/routes/tenant.ts

import { Router } from 'express';
import {
  assignTenant,
  updateTenancyStatus,
  removeTenancy,
  getPropertyTenants,
  getTenantHistory,
  getMyLease,
  getAllTenancies,
} from '../controllers/tenant.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

// All tenant routes require authentication
router.use(protect);

// ===================================
// TENANT-FACING ROUTES
// ===================================

// GET /api/tenants/my-lease — Get the current logged-in tenant's active lease
// NOTE: This route MUST be defined before /:id routes to avoid conflicts
router.get('/my-lease', restrictTo('Tenant', 'Buyer'), getMyLease);

// ===================================
// PROPERTY-SCOPED ROUTES (Manager / Owner / Admin)
// ===================================

// GET /api/tenants/property/:propertyId — Get active tenants for a property
router.get(
  '/property/:propertyId',
  restrictTo('Manager', 'Owner', 'Admin'),
  getPropertyTenants
);

// GET /api/tenants/property/:propertyId/history — Get full tenant history for a property
router.get(
  '/property/:propertyId/history',
  restrictTo('Manager', 'Owner', 'Admin'),
  getTenantHistory
);

// ===================================
// ADMIN: ALL TENANCIES
// ===================================

// GET /api/tenants — Get all tenancy records (with optional ?status=Active|Expired|Terminated)
router.get('/', restrictTo('Admin', 'Manager', 'Owner'), getAllTenancies);

// ===================================
// TENANCY CRUD (Manager / Owner / Admin)
// ===================================

// POST /api/tenants — Assign a new tenant to a property
router.post('/', restrictTo('Manager', 'Owner', 'Admin'), assignTenant);

// PATCH /api/tenants/:id — Update tenancy status (Active → Terminated / Expired)
router.patch('/:id', restrictTo('Manager', 'Owner', 'Admin'), updateTenancyStatus);

// DELETE /api/tenants/:id — Hard delete a tenancy record (Admin only)
router.delete('/:id', restrictTo('Admin'), removeTenancy);

export default router;
