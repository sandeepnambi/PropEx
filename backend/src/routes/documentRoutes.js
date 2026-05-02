import express from 'express';
import {
  uploadDocument,
  getDocumentsByLeaseId,
  deleteDocument,
} from '../controllers/documentController.js';
import { uploadDocumentMiddleware } from '../middleware/documentMulter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/upload', uploadDocumentMiddleware, uploadDocument);
router.get('/:leaseId', getDocumentsByLeaseId);
router.delete('/:id', deleteDocument);

export default router;
