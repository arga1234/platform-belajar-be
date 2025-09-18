import { pool } from '../db';
import { ImageRecord } from '../types/image';

/**
 * Create image record
 */
export const createImageRecord = async (
  parent_id: string | null,
  url: string,
  name?: string | null
): Promise<ImageRecord> => {
  const query = `
    INSERT INTO images (parent_id, name, url)
    VALUES ($1, $2, $3)
    RETURNING id, parent_id, name, url
  `;
  const values = [parent_id, name ?? null, url];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getImagesByParentId = async (parent_id: string): Promise<ImageRecord[]> => {
  const query = `SELECT id, parent_id, name, url FROM images WHERE parent_id = $1 ORDER BY id`;
  const { rows } = await pool.query(query, [parent_id]);
  return rows;
};

export const getImageById = async (id: string): Promise<ImageRecord | null> => {
  const query = `SELECT id, parent_id, name, url FROM images WHERE id = $1 LIMIT 1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0] ?? null;
};
