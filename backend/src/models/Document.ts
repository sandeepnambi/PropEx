import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDocument extends Document {
  leaseId: Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: Date;
}

const DocumentSchema: Schema = new Schema(
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

export const LeaseDocument = mongoose.model<IDocument>('Document', DocumentSchema);
