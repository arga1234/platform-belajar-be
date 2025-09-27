// src/routes/pointRoutes.ts
import { Router } from 'express';
import { pointController } from '../controllers/pointController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

/**
 * Endpoints:
 * POST   /earn                 -> earnPoints (history + update my_point) (body: { user_id, point, relationd_id?, activity_name?, is_earned? })
 * POST   /history              -> create point_history only
 * GET    /history/user/:userId -> list point_history by user
 * GET    /my-point/user/:userId-> get my_point for user
 * POST   /my-point             -> create my_point (body: { user_id, point })
 * PUT    /my-point/:id         -> update my_point by id (body: { point })
 */

router.use(authenticate);
// earn + update my_point (transactional)
router.post('/earn', pointController.earnPoints);

// use point
router.post('/use', pointController.usePoints);

// create history only
router.post('/history', pointController.createPointHistoryOnly);

// list history for user
router.get('/history', pointController.listPointHistory);

// my_point operations
router.get('/my-point/user/:userId', pointController.getMyPointByUser);
router.post('/my-point', pointController.createMyPoint);
router.put('/my-point/:id', pointController.updateMyPoint);
router.get('/leaderboard', pointController.getLeaderboard);

export default router;
