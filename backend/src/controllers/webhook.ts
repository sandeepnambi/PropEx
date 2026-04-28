import { Request, Response } from 'express';
import { stripe } from '../services/stripe.js';
import { Payment } from '../models/Payment.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Handle Stripe Webhooks
 */
export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // In production, we should verify the signature
    // For local dev/mocking, we can bypass if secret is not set
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const paymentId = session.metadata.paymentId;

    if (paymentId) {
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'Paid',
        paymentDate: new Date(),
        paymentMethod: 'Stripe',
        transactionId: session.id,
      });
      console.log(`Payment ${paymentId} marked as Paid via Stripe Webhook`);
    }
  }

  res.status(200).json({ received: true });
});
