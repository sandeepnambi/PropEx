// src/server.ts

import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listing.js';
import leadRoutes from './routes/lead.js';
import userRoutes from './routes/user.js';
import tenantRoutes from './routes/tenant.js';
import leaseRoutes from './routes/leaseRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analytics.js';
import cron from 'node-cron';
import { checkExpiringLeases, checkUpcomingRent, checkOverdueRent, generateMonthlyPayments } from './services/notificationService.js';
import { stripeWebhook } from './controllers/webhook.js';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app: Application = express();
const PORT = process.env.PORT || 5001;

// Webhook route (must be before express.json() and before CORS if needed, but usually CORS is fine)
// Stripe Webhooks need the raw body for signature verification
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// Apply CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
  })
);

// Body parser middleware
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok - reloaded' });
});

// Test route
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      
      // Schedule automated notifications to run daily at midnight
      cron.schedule('0 0 * * *', async () => {
        console.log('[Cron Job] Running daily notification checks...');
        await checkExpiringLeases();
        await checkUpcomingRent();
        await checkOverdueRent();
        await generateMonthlyPayments();
        console.log('[Cron Job] Daily checks completed.');
      });

      console.log('[Cron Job] Automated notifications scheduled (Daily at Midnight).');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();