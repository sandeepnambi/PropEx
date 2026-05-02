import mongoose from 'mongoose';

const { Schema } = mongoose;

const LeaseSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Property ID is required'],
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tenant ID is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: 0,
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: 0,
    },
    leaseStatus: {
      type: String,
      enum: ['active', 'expired', 'terminated'],
      default: 'active',
    },
    paymentFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
  },
  { timestamps: true }
);

// Middleware to auto-calculate status based on dates before saving
LeaseSchema.pre('save', function (next) {
  const now = new Date();
  if (this.leaseStatus !== 'terminated') {
    if (now > this.endDate) {
      this.leaseStatus = 'expired';
    } else if (now >= this.startDate && now <= this.endDate) {
      this.leaseStatus = 'active';
    }
  }
  next();
});

export const Lease = mongoose.model('Lease', LeaseSchema);
