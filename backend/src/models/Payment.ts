import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPayment extends Document {
  tenantId: Types.ObjectId;   // Reference to the Tenancy record (Tenant model)
  propertyId: Types.ObjectId; // Reference to the Property
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Stripe';
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentDate: { type: Date },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Bank Transfer', 'Cash', 'Stripe'],
    },
    transactionId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
