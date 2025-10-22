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

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app: Application = express();
const PORT = process.env.PORT || 5001;

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
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Test route
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/leads', leadRoutes);

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
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();