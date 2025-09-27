import { pool } from '../db'; // asumsi kamu sudah export pool

export const rewardService = {
  async createReward(urlImage: string, name: string, point: number, stock: number) {
    const q = `
      INSERT INTO rewards (url_image, name, point, stock, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;
    const res = await pool.query(q, [urlImage, name, point, stock]);
    return res.rows[0];
  },

  async decrementRewardStock(id: string) {
    const q = `
    UPDATE rewards
    SET stock = stock - 1, updated_at = NOW()
    WHERE id = $1 AND stock > 0
    RETURNING *;
  `;
    const res = await pool.query(q, [id]);
    return res.rows[0]; // kalau null artinya stok sudah habis
  },

  async getRewardList(limit = 6, offset = 0) {
    const q = `
      SELECT *
      FROM rewards
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2;
    `;
    const res = await pool.query(q, [limit, offset]);
    return res.rows;
  },
};
