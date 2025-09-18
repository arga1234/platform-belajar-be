import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import storageController from '../controllers/storageController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// configure multer to save files to ./testImages
const uploadFolder = path.join(process.cwd(), 'testImages');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/**
 * POST /upload
 * Form field: "image" (multipart/form-data)
 * returns: { filename, url, ... }
 */
router.post('/', authenticate, upload.single('image'), storageController.uploadHandler);

export default router;
