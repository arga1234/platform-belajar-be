import { Router } from 'express';
import * as contentController from '../controllers/contentController';

const contentRoutes = Router();

contentRoutes.post('/create', contentController.createContent);
contentRoutes.get('/:testId', contentController.getContentsByTestId);

export default contentRoutes;
