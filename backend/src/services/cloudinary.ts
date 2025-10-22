// src/services/cloudinary.ts

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { IImage } from '../models/Listing.js';

// 1. Define required environment variables and check for their existence
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("FATAL ERROR: Cloudinary credentials are missing from environment variables.");
  throw new Error("Cloudinary configuration missing.");
}

// 2. Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

interface CloudinaryUploadResult extends UploadApiResponse {
  secure_url: string;
  public_id: string;
}

/**
 * Uploads a file to Cloudinary
 * @param fileData - Base64 encoded image data or data URL
 * @param folder - Folder name in Cloudinary
 * @returns Promise<IImage> - Uploaded image details
 */
export const uploadImage = async (fileData: string, folder: string): Promise<IImage> => {
  try {
    const result: CloudinaryUploadResult = await cloudinary.uploader.upload(fileData, {
      folder: `realestate/${folder}`,
      resource_type: 'auto',
      quality_analysis: true,
    });

    return {
      url: result.secure_url,
      cloudinaryId: result.public_id,
      orderIndex: 0,
      altText: `Uploaded image in ${folder}`
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during image upload';
    console.error('Cloudinary Upload Error:', errorMessage);
    throw new Error(`Failed to upload image: ${errorMessage}`);
  }
};

/**
 * Deletes an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise<void>
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during image deletion';
    console.error('Cloudinary Delete Error:', errorMessage);
    throw new Error(`Failed to delete image: ${errorMessage}`);
  }
};