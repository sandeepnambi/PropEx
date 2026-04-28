import mongoose, { Document, Schema, Types } from 'mongoose';

// 1. TypeScript Interface
export interface ILead extends Document {
  listing: Types.ObjectId; // Reference to the Listing they inquired about
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const LeadSchema: Schema = new Schema(
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

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);