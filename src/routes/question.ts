import { Router } from 'express';
import * as questionController from '../controllers/questionController';
import { authenticate } from '../middleware/authenticate';

const questionRoutes = Router();

questionRoutes.use(authenticate);
questionRoutes.post('/create', questionController.createQuestion);
questionRoutes.get('/:testId', questionController.getQuestionsByTestId);
questionRoutes.post('/create/type', questionController.createQuestionType);
questionRoutes.get('/type/list', questionController.getAllQuestionTypes);
export default questionRoutes;
