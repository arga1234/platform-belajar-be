import { Router } from 'express';
import { rewardController } from '../controllers/rewardController';

const router = Router();

router.post('/', rewardController.createReward);
router.post('/:id/stock/decrement', rewardController.decrementRewardStock);
router.get('/', rewardController.getRewardList);

export default router;
