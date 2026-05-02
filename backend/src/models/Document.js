import mongoose from 'mongoose';

const { Schema } = mongoose;

const DocumentSchema = new Schema(
  {
    leaseId: {
      type: Schema.Types.ObjectId,
      ref: 'Lease',
      required: [true, 'Lease ID is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const LeaseDocument = mongoose.model('Document', DocumentSchema);
