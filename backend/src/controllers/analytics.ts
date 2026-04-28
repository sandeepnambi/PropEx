import { Request, Response } from 'express';
import { Payment } from '../models/Payment.js';
import { Listing } from '../models/Listing.js';
import { Tenant } from '../models/Tenant.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * @desc    Get management analytics (Total rent, Pending rent, Vacancy rate)
 * @route   GET /api/analytics/management
 * @access  Private (Manager/Owner/Admin)
 */
export const getManagementAnalytics = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  // 1. Get all properties for this manager
  const myProperties = await Listing.find({ agent: userId });
  const propertyIds = myProperties.map(p => p._id);

  // 2. Calculate Rent Stats
  const payments = await Payment.find({ propertyId: { $in: propertyIds } });
  
  const totalCollected = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalPending = payments
    .filter(p => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  // 3. Calculate Vacancy Rate
  const activeTenancies = await Tenant.find({ 
    property: { $in: propertyIds },
    status: 'Active' 
  });
  
  const occupiedPropertyIds = new Set(activeTenancies.map(t => t.property.toString()));
  const totalProperties = myProperties.length;
  const vacantProperties = totalProperties - occupiedPropertyIds.size;
  const vacancyRate = totalProperties > 0 ? (vacantProperties / totalProperties) * 100 : 0;

  res.status(200).json({
    status: 'success',
    data: {
      totalCollected,
      totalPending,
      vacancyRate: Math.round(vacancyRate),
      totalProperties,
      activeTenants: activeTenancies.length
    }
  });
});
