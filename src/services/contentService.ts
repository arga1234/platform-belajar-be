import { query } from '../db';

export const createContent = async (data: string, testId: string) => {
  const queryString = `
    INSERT INTO content (data, test_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await query(queryString, [data, testId]);
  return result.rows[0];
};

export const getContentsByTestId = async (testId: string) => {
  const queryString = `SELECT * FROM content WHERE test_id = $1 ORDER BY id ASC;`;
  const result = await query(queryString, [testId]);
  return result.rows;
};
