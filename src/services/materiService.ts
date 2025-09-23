import { query } from '../db';

export const createMateriByKompetensi = async (
  name: string,
  kompetensi_id: string,
  point: number
) => {
  const queryString = `
    INSERT INTO materi (name, kompetensi_id, point)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [name, kompetensi_id, point];
  const result = await query(queryString, values);
  return result.rows[0];
};

export const getMateriByKompetensi = async (kompetensi_id: string) => {
  const queryString = `
    SELECT * FROM materi WHERE kompetensi_id = $1;
  `;
  const result = await query(queryString, [kompetensi_id]);
  return result.rows;
};

export const createMateriContent = async (
  materi_id: string,
  content: string,
  order_number: number
) => {
  const queryString = `
    INSERT INTO materi_content (materi_id, content, order_number)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [materi_id, content, order_number];
  const result = await query(queryString, values);
  return result.rows[0];
};

export const getMateriContent = async (materi_id: string) => {
  const queryString = `
    SELECT * FROM materi_content
    WHERE materi_id = $1
    ORDER BY order_number ASC;
  `;
  const result = await query(queryString, [materi_id]);

  return {
    data: result.rows,
    totalPage: result.rows.length, // total item = total page
  };
};

export const createDoneMateri = async (payload: {
  user_id: string;
  materi_id: string;
  kompetensi_id: string;
}) => {
  if (!payload.user_id || !payload.materi_id || !payload.kompetensi_id) {
    throw new Error('user_id, materi_id, dan kompetensi_id wajib diisi');
  }

  // cek apakah sudah ada
  const checkQuery = `
    SELECT id 
    FROM materi_selesai 
    WHERE user_id = $1 AND materi_id = $2 AND kompetensi_id = $3
    LIMIT 1;
  `;
  const checkValues = [payload.user_id, payload.materi_id, payload.kompetensi_id];
  const { rows: existing } = await query(checkQuery, checkValues);

  if (existing.length > 0) {
    throw new Error('Materi ini sudah pernah kamu selesaikan, penambahan point tidak berlaku');
  }

  // insert kalau belum ada
  const insertQuery = `
    INSERT INTO materi_selesai (user_id, materi_id, kompetensi_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows } = await query(insertQuery, checkValues);

  return rows[0];
};

export const getDoneMateri = async (user_id: string, kompetensi_id: string) => {
  const queryString = `
    SELECT ms.materi_id
    FROM materi_selesai ms
    JOIN materi m ON m.id = ms.materi_id
    WHERE ms.user_id = $1 AND ms.kompetensi_id = $2
    ORDER BY ms.created_at DESC;
  `;
  const { rows } = await query(queryString, [user_id, kompetensi_id]);
  return rows;
};
