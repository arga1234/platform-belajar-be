import express from 'express';
import * as imageController from '../controllers/imageController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

/**
 * POST /images
 * body: { parent_id?: string, url: string }
 */
router.post('/', authenticate, imageController.createImage);

/**
 * GET /images?parent_id=<uuid>
 */
router.get('/', imageController.listImagesByParent);

/**
 * GET /images/:id/link
 * redirects to the actual file/url
 */
router.get('/:id/link', imageController.getImageLink);

export default router;
