// src/services/pointService.ts
import { pool } from '../db';

export type UUID = string;

export interface CreatePointHistoryDto {
  relationd_id?: UUID | null;
  point: number;
  user_id: UUID;
  is_earned?: boolean;
  activity_name?: string;
}

export interface MyPointDto {
  id?: UUID;
  point: number;
  user_id: UUID;
  created_at?: string;
  updated_at?: string;
}

export interface UsePointDto {
  relationd_id?: UUID | null;
  point: number; // positive number = jumlah yang dipakai
  user_id: UUID;
  activity_name?: string;
}

export const pointService = {
  async createPointHistory(dbClientOrPool: any, dto: CreatePointHistoryDto) {
    const q = `
      INSERT INTO point_history
        (relationd_id, point, user_id, is_earned, activity_name, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const params = [
      dto.relationd_id ?? null,
      dto.point,
      dto.user_id,
      dto.is_earned ?? true,
      dto.activity_name ?? null,
    ];
    const res = await dbClientOrPool.query(q, params);
    return res.rows[0];
  },

  async getPointHistory(filters: { userId?: string; isEarned?: boolean }, limit = 100, offset = 0) {
    const whereClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.userId) {
      whereClauses.push(`user_id = $${paramIndex++}`);
      params.push(filters.userId);
    }

    if (filters.isEarned !== undefined) {
      whereClauses.push(`is_earned = $${paramIndex++}`);
      params.push(filters.isEarned);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const q = `
    SELECT *
    FROM point_history
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++};
  `;

    params.push(limit, offset);

    const res = await pool.query(q, params);
    return res.rows;
  },

  async getMyPointByUser(userId: UUID) {
    const q = `SELECT * FROM my_point WHERE user_id = $1 LIMIT 1;`;
    const res = await pool.query(q, [userId]);
    return res.rows[0] ?? null;
  },

  async createMyPoint(dto: MyPointDto) {
    const q = `
      INSERT INTO my_point (id, point, user_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
      RETURNING *;
    `;
    const res = await pool.query(q, [dto.point, dto.user_id]);
    return res.rows[0];
  },

  async updateMyPointById(id: UUID, point: number) {
    const q = `
      UPDATE my_point
      SET point = $1, updated_at = NOW()
      WHERE user_id = $2
      RETURNING *;
    `;
    const res = await pool.query(q, [point, id]);
    return res.rows[0] ?? null;
  },

  /**
   * Earn points: insert into point_history and add to my_point (insert if not exists / update if exists).
   * This runs inside the provided client (so caller may control transaction).
   */
  async earnPointsTransaction(client: any, dto: CreatePointHistoryDto) {
    // 1) insert into point_history using provided client
    const history = await this.createPointHistory(client, dto);

    // 2) try update existing my_point by user_id
    const updateQ = `
      UPDATE my_point
      SET point = point + $1, updated_at = NOW()
      WHERE user_id = $2
      RETURNING *;
    `;
    const updRes = await client.query(updateQ, [dto.point, dto.user_id]);

    if (updRes.rowCount > 0) {
      return { history, my_point: updRes.rows[0], created: false };
    }

    // 3) if not updated (no row), insert new my_point
    const insertQ = `
      INSERT INTO my_point (id, point, user_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
      RETURNING *;
    `;
    const insRes = await client.query(insertQ, [dto.point, dto.user_id]);

    return { history, my_point: insRes.rows[0], created: true };
  },

  async usePointsTransaction(client: any, dto: UsePointDto) {
    // 1) Lock my_point row for update to avoid race
    const selQ = `SELECT * FROM my_point WHERE user_id = $1 FOR UPDATE;`;
    const selRes = await client.query(selQ, [dto.user_id]);

    if (selRes.rowCount === 0) {
      // no balance row
      throw new Error('No points balance for user');
    }

    const myPointRow = selRes.rows[0];
    const currentPoint = Number(myPointRow.point ?? 0);
    const useAmount = Number(dto.point);

    if (useAmount <= 0) throw new Error('Invalid point amount');

    if (currentPoint < useAmount) {
      throw new Error('Insufficient points');
    }

    // 2) insert into point_history as negative point and is_earned = false
    const insertHistoryQ = `
    INSERT INTO point_history
      (relationd_id, point, user_id, is_earned, activity_name, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
    const historyParams = [
      dto.relationd_id ?? null,
      -useAmount, // store negative to indicate deduction
      dto.user_id,
      false, // is_earned = false
      dto.activity_name ?? null,
    ];
    const histRes = await client.query(insertHistoryQ, historyParams);
    const history = histRes.rows[0];

    // 3) update my_point subtracting the amount
    const updQ = `
    UPDATE my_point
    SET point = point - $1, updated_at = NOW()
    WHERE user_id = $2
    RETURNING *;
  `;
    const updRes = await client.query(updQ, [useAmount, dto.user_id]);

    return { history, my_point: updRes.rows[0], used: true };
  },

  async getLeaderboard() {
    const query = `
    SELECT 
      mp.*, 
      u.nama_lengkap 
    FROM my_point mp
    LEFT JOIN users u ON mp.user_id = u.id
    ORDER BY mp.point DESC, mp.updated_at ASC;
  `;

    const { rows } = await pool.query(query);
    return rows;
  },

  // helper to get pool for callers
  getPool() {
    return pool;
  },
};
