import mongoose from 'mongoose';

const { Schema } = mongoose;

// Mongoose Schema
const ListingSchema = new Schema(
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

export const Listing = mongoose.model('Listing', ListingSchema);
