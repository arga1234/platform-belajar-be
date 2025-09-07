import { pool } from '../db';

interface CreateTestInput {
  name: string;
  parent_id?: string;
  live_at?: string;
  test_type_id: string;
}

export const createTest = async (input: CreateTestInput) => {
  const query = `
    INSERT INTO test (name, parent_id, live_at, test_type_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [input.name, input.parent_id || null, input.live_at || null, input.test_type_id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getTestsByParent = async (parentId: string) => {
  const query = `SELECT * FROM test WHERE parent_id = $1 ORDER BY live_at ASC NULLS;`;
  const { rows } = await pool.query(query, [parentId]);
  return rows;
};

export const getTestsByType = async (testTypeId: string) => {
  const query = `SELECT * FROM test WHERE test_type_id = $1 ORDER BY live_at ASC NULLS;`;
  const { rows } = await pool.query(query, [testTypeId]);
  return rows;
};

export const getNearestTest = async (testTypeId: string) => {
  const query = `
    SELECT * FROM test
    WHERE test_type_id = $1
      AND live_at IS NOT NULL
      AND live_at >= NOW()
    ORDER BY live_at ASC
    LIMIT 3;
  `;
  const { rows } = await pool.query(query, [testTypeId]);
  return rows[0] || null;
};
