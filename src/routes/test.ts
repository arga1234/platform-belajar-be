import { Router } from 'express';
import * as testController from '../controllers/testController';
import { authenticate } from '../middleware/authenticate';

const testRoutes = Router();

testRoutes.post('/create', testController.createTest);

testRoutes.get('/parent/:parentId', authenticate, testController.getTestsByParent);

testRoutes.get('/type/:testTypeId', authenticate, testController.getTestsByType);

testRoutes.get('/live/:testTypeId', authenticate, testController.getNearestTest);

testRoutes.post('/create/type', authenticate, testController.createTestType);

testRoutes.get('/type', authenticate, testController.getAllTestTypes);

testRoutes.post('/capaian/create', testController.createHasilCapaian);

testRoutes.get('/capaian/:userId', authenticate, testController.getHasilCapaianByUserId);

testRoutes.get(
  '/capaian/skor/:userId/:testId',
  authenticate,
  testController.getHasilCapaianByUserIdAndTestId
);

testRoutes.get('/capaian/detail/:id', authenticate, testController.getHasilCapaianDetailById);

testRoutes.get('/capaian/rank/:testId', testController.getHasilCapaianByTestId);

testRoutes.get(
  '/capaian/user/:userId/:testTypeId',
  testController.getHasilCapaianByUserIdAndTestTypeId
);

export default testRoutes;
