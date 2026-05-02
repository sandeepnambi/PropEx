// backend/src/models/Tenant.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Mongoose Schema
const TenantSchema = new Schema(
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

export const Tenant = mongoose.model('Tenant', TenantSchema);
