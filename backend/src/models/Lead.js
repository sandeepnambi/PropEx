import mongoose from 'mongoose';

const { Schema } = mongoose;

// Mongoose Schema
const LeadSchema = new Schema(
  {
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export const Lead = mongoose.model('Lead', LeadSchema);
