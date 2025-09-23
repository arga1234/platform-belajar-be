import { pool } from '../db';

interface CreateTestInput {
  name: string;
  parent_id?: string;
  live_at?: string;
  live_end?: string;
  test_type_id: string;
  jumlah_soal: number;
  durasi_seconds: number;
}

export const createTest = async (input: CreateTestInput) => {
  const query = `
    INSERT INTO test (name, parent_id, live_at, test_type_id, live_end, jumlah_soal, durasi_seconds)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    input.name,
    input.parent_id || null,
    input.live_at || null,
    input.test_type_id,
    input.live_end || null,
    input.jumlah_soal || 0,
    input.durasi_seconds || 0,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getTestsByParent = async (parentId: string) => {
  const query = `SELECT * FROM test WHERE parent_id = $1 ORDER BY created_at ASC;`;
  const { rows } = await pool.query(query, [parentId]);
  return rows;
};

export const getTestsByType = async (testTypeId: string) => {
  const query = `SELECT * FROM test WHERE test_type_id = $1 ORDER BY created_At DESC;`;
  const { rows } = await pool.query(query, [testTypeId]);
  return rows;
};

export const getNearestTest = async (testTypeId: string) => {
  const query = `
    SELECT * FROM test
    WHERE test_type_id = $1
      AND live_at IS NOT NULL
      AND live_end >= NOW()
    ORDER BY live_at ASC
    LIMIT 3;
  `;
  const { rows } = await pool.query(query, [testTypeId]);
  return rows || null;
};

export const createTestType = async (name: string) => {
  const query = `
    INSERT INTO test_type (name)
    VALUES ($1)
    RETURNING *;
  `;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

export const getAllTestTypes = async () => {
  const query = `SELECT * FROM test_type ORDER BY name ASC;`;
  const result = await pool.query(query);
  return result.rows;
};

export interface HasilCapaian {
  user_id: string;
  user_name: string;
  test_id: string;
  test_name?: string;
  test_type_id?: string;
  test_type_name?: string;
  skor?: number;
  time_spent?: string;
  persentase_benar_by_domain?: any;
  persentase_benar_by_sub_domain?: any;
  persentase_benar_by_type_answer?: any;
  persentase_benar_by_kompetensi?: any;
  jawaban?: any;
  parent_id?: any;
}

export const createHasilCapaian = async (data: HasilCapaian) => {
  // Cek apakah sudah ada hasil capaian untuk user_id + test_id
  const checkQuery = `
    SELECT id, test_type_name FROM hasil_capaian
    WHERE user_id = $1 AND test_id = $2;
  `;
  const checkResult = await pool.query(checkQuery, [data.user_id, data.test_id]);

  if (
    checkResult.rowCount &&
    checkResult.rowCount > 0 &&
    checkResult.rows.map((el) => el.test_type_name).includes(data.test_type_name)
  ) {
    throw {
      isDone: true,
      error: 'Ujian sudah pernah kamu kerjakan',
    };
  }

  // Insert data baru
  const query = `
    INSERT INTO hasil_capaian (
      user_id, user_name, test_id, test_name, test_type_id, test_type_name, 
      skor, time_spent, persentase_benar_by_domain, persentase_benar_by_sub_domain, 
      persentase_benar_by_type_answer, persentase_benar_by_kompetensi, jawaban, parent_id
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
    ) RETURNING *;
  `;

  const values = [
    data.user_id,
    data.user_name,
    data.test_id,
    data.test_name || null,
    data.test_type_id || null,
    data.test_type_name || null,
    data.skor || null,
    data.time_spent || null,
    data.persentase_benar_by_domain || null,
    data.persentase_benar_by_sub_domain || null,
    data.persentase_benar_by_type_answer || null,
    data.persentase_benar_by_kompetensi || null,
    data.jawaban || null,
    data.parent_id || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getHasilCapaianByUserId = async (userId: string) => {
  const query = `SELECT * FROM hasil_capaian WHERE user_id = $1;`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export async function getHasilCapaianByTestId(testId: string): Promise<HasilCapaian[]> {
  const query = `
    SELECT * FROM hasil_capaian WHERE test_id = $1 ORDER BY skor DESC
  `;
  const result = await pool.query(query, [testId]);
  return result.rows as HasilCapaian[];
}

export const getHasilCapaianByUserIdAndTestId = async (userId: string, testId: string) => {
  const query = `SELECT * FROM hasil_capaian WHERE user_id = $1 AND test_id = $2;`;
  const result = await pool.query(query, [userId, testId]);
  return result.rows;
};

export const getHasilCapaianDetailById = async (id: string) => {
  const query = `SELECT * FROM hasil_capaian WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const getHasilCapaianByUserIdAndTestTypeId = async (userId: string, testTypeId: string) => {
  const query = `SELECT * FROM hasil_capaian WHERE user_id = $1 AND test_type_id = $2 order by created_at desc;`;
  const result = await pool.query(query, [userId, testTypeId]);
  return result.rows;
};

export const getHasilCapaianByUserIdKompetensiIdTestTypeId = async (
  userId: string,
  kompetensi_id: string,
  testTypeId: string
) => {
  const query = `SELECT * FROM hasil_capaian WHERE user_id = $1 AND test_type_id = $2 AND parent_id = $3 order by created_at desc;`;
  const result = await pool.query(query, [userId, testTypeId, kompetensi_id]);
  return result.rows;
};
