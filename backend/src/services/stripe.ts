import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20' as any,
});

/**
 * Create a Stripe Checkout Session for a rent payment
 */
export const createStripeCheckoutSession = async (
  paymentId: string,
  amount: number,
  propertyTitle: string,
  tenantEmail: string
) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Rent Payment: ${propertyTitle}`,
            description: `Payment for ID: ${paymentId}`,
          },
          unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tenant-dashboard?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tenant-dashboard?payment=cancelled`,
    customer_email: tenantEmail,
    metadata: {
      paymentId: paymentId,
    },
  });

  return session;
};
