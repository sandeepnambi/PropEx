// src/middleware/multer.ts

import multer from 'multer';

// Configure storage to keep the file in memory (buffer)
const multerStorage = multer.memoryStorage();

/**
 * Filters incoming files to ensure they are images.
 * @param req The Express Request object
 * @param file The file being processed
 * @param cb The callback function to signal acceptance/rejection
 */
const multerFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    // Accept file
    cb(null, true); 
  } else {
    // Reject file with an error
    cb(new Error('Not an image! Please upload only images.') as any, false);
  }
};

// Initialize Multer upload function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Optional: Limit file size to 10MB
  }
});

/**
 * Middleware function for handling the upload of listing images.
 * It expects a field named 'images' and allows up to 5 files.
 */
export const uploadListingImages = upload.array('images', 5);