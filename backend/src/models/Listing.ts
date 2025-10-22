import mongoose, { Document, Schema, Types } from 'mongoose';

// Image Sub-interface
export interface IImage {
  url: string;
  cloudinaryId: string;
  altText?: string;
  orderIndex: number;
}

// 1. TypeScript Interface
export interface IListing extends Document {
  agent: Types.ObjectId; // Reference to the User (Agent) who owns the listing
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  propertyType: 'House' | 'Condo' | 'Townhouse' | 'Land' | 'Apartment';
  bedrooms: number;
  bathrooms: number;
  sqFt: number;
  yearBuilt: number;
  status: 'Active' | 'Pending' | 'Sold' | 'Draft';
  images: IImage[];
  isFeatured: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const ListingSchema: Schema = new Schema(
  {
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    propertyType: {
      type: String,
      enum: ['House', 'Condo', 'Townhouse', 'Land', 'Apartment'],
      required: true,
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    sqFt: { type: Number, required: true, min: 0 },
    yearBuilt: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Sold', 'Draft'],
      default: 'Draft',
    },
    images: [
      {
        url: { type: String, required: true },
        cloudinaryId: { type: String, required: true },
        altText: String,
        orderIndex: { type: Number, default: 0 },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Listing = mongoose.model<IListing>('Listing', ListingSchema);