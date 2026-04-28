import { Request, Response } from 'express';
import { Payment } from '../models/Payment.js';
import { Tenant } from '../models/Tenant.js';
import { Listing } from '../models/Listing.js';
import catchAsync from '../utils/catchAsync.js';
import { createStripeCheckoutSession } from '../services/stripe.js';
import { generateMonthlyPayments } from '../services/notificationService.js';

/**
 * @desc    Get all payments (Admin) or payments for properties managed by the user (Manager/Owner)
 * @route   GET /api/payments
 * @access  Private
 */
export const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  let query = {};

  if (req.user?.role !== 'Admin') {
    // If Manager or Owner, only fetch payments for properties they manage
    const properties = await Listing.find({ agent: req.user?._id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    query = { propertyId: { $in: propertyIds } };
  }

  const payments = await Payment.find(query)
    .sort({ dueDate: -1 })
    .populate({
      path: 'tenantId',
      populate: { path: 'tenant', select: 'firstName lastName email' }
    })
    .populate('propertyId', 'title address city');

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: { payments }
  });
});

/**
 * @desc    Get current tenant's payments
 * @route   GET /api/payments/my-payments
 * @access  Private/Tenant
 */
export const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  // 1. Find the tenancy record for this user
  const tenancy = await Tenant.findOne({ tenant: req.user?._id, status: 'Active' });

  if (!tenancy) {
    return res.status(200).json({
      status: 'success',
      data: { payments: [] }
    });
  }

  // 2. Proactively generate payments if missing for this month
  // We can just call the service, it already checks if they exist
  await generateMonthlyPayments();

  // 3. Get all payments for this tenancy
  const payments = await Payment.find({ tenantId: tenancy._id })
    .sort({ dueDate: -1 })
    .populate('propertyId', 'title address');

  res.status(200).json({
    status: 'success',
    data: { payments }
  });
});

/**
 * @desc    Get payments for a specific property (Manager/Owner/Admin)
 * @route   GET /api/payments/property/:propertyId
 * @access  Private
 */
export const getPropertyPayments = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  
  const payments = await Payment.find({ propertyId })
    .sort({ dueDate: -1 })
    .populate({
      path: 'tenantId',
      populate: { path: 'tenant', select: 'firstName lastName' }
    });

  res.status(200).json({
    status: 'success',
    data: { payments }
  });
});

/**
 * @desc    Record a new payment (Manager/Admin)
 * @route   POST /api/payments
 * @access  Private
 */
export const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { tenantId, propertyId, amount, dueDate, status, notes } = req.body;

  const payment = await Payment.create({
    tenantId,
    propertyId,
    amount,
    dueDate,
    status: status || 'Pending',
    notes
  });

  res.status(201).json({
    status: 'success',
    data: { payment }
  });
});

/**
 * @desc    Update payment status (Manager/Admin)
 * @route   PATCH /api/payments/:id
 * @access  Private
 */
export const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { status, paymentDate, paymentMethod, transactionId, notes } = req.body;
  
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { 
      status, 
      paymentDate: status === 'Paid' ? (paymentDate || new Date()) : paymentDate,
      paymentMethod,
      transactionId,
      notes 
    },
    { new: true, runValidators: true }
  );

  if (!payment) {
    return res.status(404).json({ status: 'fail', message: 'Payment not found' });
  }

  res.status(200).json({
    status: 'success',
    data: { payment }
  });
});

/**
 * @desc    Create a Stripe checkout session for a payment
 * @route   POST /api/payments/checkout-session/:id
 * @access  Private/Tenant
 */
export const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 1. Find the payment record
  const payment = await Payment.findById(id)
    .populate({
      path: 'tenantId',
      populate: { path: 'tenant', select: 'email' }
    })
    .populate('propertyId', 'title');

  if (!payment) {
    return res.status(404).json({ status: 'fail', message: 'Payment not found' });
  }

  // 2. Security Check: Ensure this payment belongs to the logged-in user
  const tenancy = payment.tenantId as any;
  if (tenancy.tenant._id.toString() !== req.user?._id.toString()) {
    return res.status(403).json({ status: 'fail', message: 'Not authorized to pay this record' });
  }

  if (payment.status === 'Paid') {
    return res.status(400).json({ status: 'fail', message: 'Payment already completed' });
  }

  // 3. Create Stripe session
  const propertyTitle = (payment.propertyId as any).title;
  const tenantEmail = tenancy.tenant.email;

  const session = await createStripeCheckoutSession(
    (payment as any)._id.toString(),
    (payment as any).amount,
    propertyTitle,
    tenantEmail
  );

  res.status(200).json({
    status: 'success',
    url: session.url
  });
});
