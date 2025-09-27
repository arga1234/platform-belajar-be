import { Request, Response, NextFunction } from 'express';
import { rewardService } from '../services/rewardService';

export const rewardController = {
  async createReward(req: Request, res: Response, next: NextFunction) {
    try {
      const { urlImage, name, point, stock } = req.body;
      const reward = await rewardService.createReward(urlImage, name, point, stock);
      res.json({ success: true, data: reward });
    } catch (err) {
      next(err);
    }
  },

  async decrementRewardStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reward = await rewardService.decrementRewardStock(id);

      if (!reward) {
        return res.status(400).json({ success: false, message: 'Stock kosong' });
      }

      res.json({ success: true, data: reward });
    } catch (err) {
      next(err);
    }
  },

  async getRewardList(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit ?? 6);
      const offset = Number(req.query.offset ?? 0);
      const rewards = await rewardService.getRewardList(limit, offset);
      res.json({ success: true, data: rewards });
    } catch (err) {
      next(err);
    }
  },
};
