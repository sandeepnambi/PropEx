import { z } from 'zod';

export const leaseSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  rentAmount: z.number().min(0, 'Rent amount must be positive'),
  securityDeposit: z.number().min(0, 'Security deposit must be positive'),
  paymentFrequency: z.enum(['monthly', 'quarterly', 'yearly']),
  leaseStatus: z.enum(['active', 'expired', 'terminated']).optional(),
});

export type LeaseFormData = z.infer<typeof leaseSchema>;
