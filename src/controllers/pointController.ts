// src/controllers/pointController.ts
import { Request, Response, NextFunction } from 'express';
import { pointService } from '../services/pointService';

export const pointController = {
  async usePoints(req: Request, res: Response, next: NextFunction) {
    const dto = req.body; // { user_id, point, relationd_id?, activity_name? }
    const pool = pointService.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await pointService.usePointsTransaction(client, dto);
      await client.query('COMMIT');
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      await client.query('ROLLBACK').catch(() => {});
      // contoh: kirim error 400 untuk kasus business (insufficient / invalid)
      if (
        err?.message === 'Insufficient points' ||
        err?.message === 'No points balance for user' ||
        err?.message === 'Invalid point amount'
      ) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    } finally {
      client.release();
    }
  },
  async earnPoints(req: Request, res: Response, next: NextFunction) {
    const dto = req.body; // expects { user_id, relationd_id?, point, activity_name?, is_earned? }
    const pool = pointService.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await pointService.earnPointsTransaction(client, dto);
      await client.query('COMMIT');
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      next(err);
    } finally {
      client.release();
    }
  },

  async createPointHistoryOnly(req: Request, res: Response, next: NextFunction) {
    const dto = req.body;
    try {
      const history = await pointService.createPointHistory(pointService.getPool(), dto);
      res.status(201).json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  },

  async listPointHistory(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit ?? 100);
    const offset = Number(req.query.offset ?? 0);

    const userId = req.query.user_id ? String(req.query.user_id) : undefined;
    const isEarned =
      req.query.is_earned !== undefined
        ? req.query.is_earned === 'true' || req.query.is_earned === '1'
        : undefined;

    try {
      const rows = await pointService.getPointHistory({ userId, isEarned }, limit, offset);
      res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  },
  async getMyPointByUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    try {
      const myPoint = await pointService.getMyPointByUser(userId);
      if (!myPoint) return res.json({ success: true, data: 0 });
      res.json({ success: true, data: myPoint });
    } catch (err) {
      next(err);
    }
  },

  async createMyPoint(req: Request, res: Response, next: NextFunction) {
    const dto = req.body; // { user_id, point }
    try {
      const created = await pointService.createMyPoint(dto);
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      next(err);
    }
  },

  async updateMyPoint(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const { point } = req.body;
    try {
      const updated = await pointService.updateMyPointById(id, point);
      if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await pointService.getLeaderboard();
      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      console.error('Error getLeaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  },
};
