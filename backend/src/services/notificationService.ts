import { Tenant } from '../models/Tenant.js';
import { Payment } from '../models/Payment.js';
import { sendEmail } from './email.js';

/**
 * Service to handle automated notifications (Lease Expiry, Rent Due)
 */

/**
 * Check for leases expiring in exactly 30 days and notify tenants
 */
export const checkExpiringLeases = async () => {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    
    // Normalize targetDate to start of day for comparison
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const expiringLeases = await Tenant.find({
      status: 'Active',
      leaseEnd: { $gte: startOfDay, $lte: endOfDay }
    }).populate('tenant', 'firstName email').populate('property', 'title');

    console.log(`[Notification Service] Found ${expiringLeases.length} leases expiring on ${startOfDay.toLocaleDateString()}.`);

    for (const lease of expiringLeases) {
      const tenant = lease.tenant as any;
      const property = lease.property as any;
      
      const subject = '🔔 Lease Expiry Reminder - PropEx';
      const text = `Hi ${tenant.firstName}, your lease for ${property.title} is expiring on ${new Date(lease.leaseEnd).toLocaleDateString()}. Please contact your manager if you wish to renew.`;
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">Lease Expiry Reminder</h2>
          <p>Hi <strong>${tenant.firstName}</strong>,</p>
          <p>This is a friendly reminder that your lease for <strong>${property.title}</strong> is scheduled to expire on <strong>${new Date(lease.leaseEnd).toLocaleDateString()}</strong>.</p>
          <p>Please log into your dashboard or contact your property manager if you would like to discuss a renewal or move-out procedures.</p>
          <br>
          <p>Best regards,<br>The PropEx Team</p>
        </div>
      `;

      await sendEmail(tenant.email, subject, text, html);
    }

    return expiringLeases.length;
  } catch (error) {
    console.error('[Notification Service] Error checking expiring leases:', error);
    return 0;
  }
};

/**
 * Check for rent due in 3 days and notify tenants
 */
export const checkUpcomingRent = async () => {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const upcomingPayments = await Payment.find({
      status: 'Pending',
      dueDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate({
      path: 'tenantId',
      populate: { path: 'tenant', select: 'firstName email' }
    }).populate('propertyId', 'title');

    console.log(`[Notification Service] Found ${upcomingPayments.length} payments due on ${startOfDay.toLocaleDateString()}.`);

    for (const payment of upcomingPayments) {
      const tenancy = payment.tenantId as any;
      const tenant = tenancy.tenant;
      const property = payment.propertyId as any;

      const subject = '💰 Rent Due Reminder - PropEx';
      const text = `Hi ${tenant.firstName}, your rent of $${payment.amount} for ${property.title} is due in 3 days (${new Date(payment.dueDate).toLocaleDateString()}).`;
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #28a745;">Rent Due Soon</h2>
          <p>Hi <strong>${tenant.firstName}</strong>,</p>
          <p>This is a reminder that your rent payment for <strong>${property.title}</strong> is due in 3 days.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 5px solid #28a745; margin: 20px 0;">
            <p style="margin: 0;"><strong>Amount Due:</strong> $${payment.amount}</p>
            <p style="margin: 0;"><strong>Due Date:</strong> ${new Date(payment.dueDate).toLocaleDateString()}</p>
          </div>
          <p>Please log into your dashboard to make the payment or record your transaction.</p>
          <br>
          <p>Best regards,<br>The PropEx Team</p>
        </div>
      `;

      await sendEmail(tenant.email, subject, text, html);
    }

    return upcomingPayments.length;
  } catch (error) {
    console.error('[Notification Service] Error checking upcoming rent:', error);
    return 0;
  }
};

/**
 * Check for overdue rent and notify tenants
 */
export const checkOverdueRent = async () => {
  try {
    const now = new Date();

    const overduePayments = await Payment.find({
      status: 'Pending',
      dueDate: { $lt: now }
    }).populate({
      path: 'tenantId',
      populate: { path: 'tenant', select: 'firstName email' }
    }).populate('propertyId', 'title');

    console.log(`[Notification Service] Found ${overduePayments.length} overdue payments.`);

    for (const payment of overduePayments) {
      // Update status to Overdue
      payment.status = 'Overdue';
      await payment.save();

      const tenancy = payment.tenantId as any;
      const tenant = tenancy.tenant;
      const property = payment.propertyId as any;

      const subject = '⚠️ URGENT: Rent Overdue - PropEx';
      const text = `Hi ${tenant.firstName}, your rent of $${payment.amount} for ${property.title} is OVERDUE. It was due on ${new Date(payment.dueDate).toLocaleDateString()}.`;
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #dc3545;">Rent Overdue Notification</h2>
          <p>Hi <strong>${tenant.firstName}</strong>,</p>
          <p style="color: #dc3545; font-weight: bold;">Your rent payment for ${property.title} is now overdue.</p>
          <div style="background-color: #fff3f3; padding: 15px; border-left: 5px solid #dc3545; margin: 20px 0;">
            <p style="margin: 0;"><strong>Amount:</strong> $${payment.amount}</p>
            <p style="margin: 0;"><strong>Original Due Date:</strong> ${new Date(payment.dueDate).toLocaleDateString()}</p>
          </div>
          <p>Please make the payment immediately to avoid any late fees or further actions.</p>
          <br>
          <p>Best regards,<br>The PropEx Team</p>
        </div>
      `;

      await sendEmail(tenant.email, subject, text, html);
    }

    return overduePayments.length;
  } catch (error) {
    console.error('[Notification Service] Error checking overdue rent:', error);
    return 0;
  }
};

/**
 * Automated monthly payment generation
 * Runs daily to ensure every active tenant has a bill for the current month
 */
export const generateMonthlyPayments = async () => {
  try {
    const activeTenancies = await Tenant.find({ status: 'Active' });
    let createdCount = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    for (const tenancy of activeTenancies) {
      // Check if a payment for THIS MONTH already exists for this tenancy
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

      const existingPayment = await Payment.findOne({
        tenantId: tenancy._id,
        dueDate: { $gte: startOfMonth, $lte: endOfMonth }
      });

      if (!existingPayment) {
        // Create new payment record
        // The due date is the same day of the month as the lease start date
        const leaseStartDay = new Date(tenancy.leaseStart).getDate();
        
        // If the current month has fewer days than the lease start day (e.g., Feb 31), use the last day of the month
        const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const actualDay = Math.min(leaseStartDay, lastDayOfCurrentMonth);
        
        const dueDate = new Date(currentYear, currentMonth, actualDay);

        await Payment.create({
          tenantId: tenancy._id,
          propertyId: tenancy.property,
          amount: tenancy.rentAmount,
          dueDate: dueDate,
          status: 'Pending'
        });
        createdCount++;
      }
    }

    if (createdCount > 0) {
      console.log(`[Notification Service] Generated ${createdCount} new monthly payment records.`);
    }
    return createdCount;
  } catch (error) {
    console.error('[Notification Service] Error generating monthly payments:', error);
    return 0;
  }
};
