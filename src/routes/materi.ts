import { Router } from 'express';
import * as materiController from '../controllers/materiController';
import { authenticate } from '../middleware/authenticate';

const materiRoutes = Router();

materiRoutes.use(authenticate);
// Materi
materiRoutes.post('/materi', materiController.createMateriByKompetensi);
materiRoutes.get('/materi/:kompetensiId', materiController.getMateriByKompetensi);

// Materi Content
materiRoutes.post('/materi/:materiId/content', materiController.createMateriContent);
materiRoutes.get('/materi/:materiId/content', materiController.getMateriContent);

materiRoutes.post('/materi/done', materiController.createDoneMateri);
materiRoutes.get('/materi/done/:user_id/:kompetensi_id', materiController.getDoneMateri);

export default materiRoutes;
