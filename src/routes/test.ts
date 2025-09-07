import { Router } from 'express';
import * as testController from '../controllers/testController';
import { authenticate } from '../middleware/authenticate';

const testRoutes = Router();

testRoutes.use(authenticate);

testRoutes.post('/create', testController.createTest);

// get by parent_id
testRoutes.get('/parent/:parentId', testController.getTestsByParent);

// get by test_type_id
testRoutes.get('/type/:testTypeId', testController.getTestsByType);

// get nearest live_at by test_type_id
testRoutes.get('/live/:testTypeId', testController.getNearestTest);

export default testRoutes;
