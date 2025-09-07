import { Router } from 'express';
import * as testController from '../controllers/testController';
import { authenticate } from '../middleware/authenticate';
import { getHasilCapaianByUserId } from '../services/testService';

const testRoutes = Router();

testRoutes.use(authenticate);

testRoutes.post('/create', testController.createTest);

testRoutes.get('/parent/:parentId', testController.getTestsByParent);

testRoutes.get('/type/:testTypeId', testController.getTestsByType);

testRoutes.get('/live/:testTypeId', testController.getNearestTest);

testRoutes.post('/create/type', testController.createTestType);

testRoutes.get('/type', testController.getAllTestTypes);

testRoutes.post('/capaian/create', testController.createHasilCapaian);

testRoutes.get('/capaian/:userId', testController.getHasilCapaianByUserId);

export default testRoutes;
