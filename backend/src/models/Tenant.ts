// backend/src/models/Tenant.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

// TypeScript Interface
export interface ITenant extends Document {
  tenant: Types.ObjectId;    // Reference to User (with role 'Tenant')
  property: Types.ObjectId;  // Reference to Listing
  leaseStart: Date;
  leaseEnd: Date;
  rentAmount: number;
  status: 'Active' | 'Expired' | 'Terminated';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const TenantSchema: Schema = new Schema(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tenant user is required'],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Property (Listing) is required'],
    },
    leaseStart: {
      type: Date,
      required: [true, 'Lease start date is required'],
    },
    leaseEnd: {
      type: Date,
      required: [true, 'Lease end date is required'],
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: [0, 'Rent amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Terminated'],
      default: 'Active',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for fast lookups by property and tenant
TenantSchema.index({ property: 1, status: 1 });
TenantSchema.index({ tenant: 1, status: 1 });

export const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);
