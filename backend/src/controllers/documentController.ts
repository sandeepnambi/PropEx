import { Request, Response, NextFunction } from 'express';
import { LeaseDocument } from '../models/Document.js';
import catchAsync from '../utils/catchAsync.js';
import path from 'path';
import fs from 'fs';

/**
 * @desc    Upload a document for a lease
 * @route   POST /api/documents/upload
 * @access  Private
 */
export const uploadDocument = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please upload a file',
    });
  }

  const { leaseId } = req.body;
  if (!leaseId) {
    return res.status(400).json({
      status: 'fail',
      message: 'Lease ID is required',
    });
  }

  const document = await LeaseDocument.create({
    leaseId,
    fileName: req.file.originalname,
    fileUrl: `/uploads/documents/${req.file.filename}`,
    fileType: req.file.mimetype,
  });

  res.status(201).json({
    status: 'success',
    data: {
      document,
    },
  });
});

/**
 * @desc    Get all documents for a lease
 * @route   GET /api/documents/:leaseId
 * @access  Private
 */
export const getDocumentsByLeaseId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const documents = await LeaseDocument.find({ leaseId: req.params.leaseId });

  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: {
      documents,
    },
  });
});

/**
 * @desc    Delete a document
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
export const deleteDocument = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const document = await LeaseDocument.findById(req.params.id);

  if (!document) {
    return res.status(404).json({
      status: 'fail',
      message: 'Document not found',
    });
  }

  // Delete from local storage
  const filePath = path.join(process.cwd(), 'uploads', 'documents', path.basename(document.fileUrl));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await document.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
