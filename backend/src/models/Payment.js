import mongoose from 'mongoose';

const { Schema } = mongoose;

const PaymentSchema = new Schema(
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

export const Payment = mongoose.model('Payment', PaymentSchema);
