import { Router } from 'express';
import { getProfileController, login, register } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile/:userId', getProfileController);
export default router;
