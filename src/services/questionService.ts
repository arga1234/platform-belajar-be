import { query } from '../db';

export const createQuestion = async (questionData: {
  test_id: string;
  content_id?: string; // optional
  domain_id: string;
  domain_name: string;
  sub_domain_id: string;
  sub_domain_name: string;
  kompetensi_id: string;
  kompetensi_name: string;
  question_type_id: string;
  question_type_name: string;
  data: any;
  question: string;
  pembahasan: string;
}) => {
  // daftar kolom dan nilai
  const columns = [
    'test_id',
    ...(questionData.content_id ? ['content_id'] : []),
    'domain_id',
    'domain_name',
    'sub_domain_id',
    'sub_domain_name',
    'kompetensi_id',
    'kompetensi_name',
    'question_type_id',
    'question_type_name',
    'data',
    'question',
    'pembahasan',
  ];

  const values = [
    questionData.test_id,
    ...(questionData.content_id ? [questionData.content_id] : []),
    questionData.domain_id,
    questionData.domain_name,
    questionData.sub_domain_id,
    questionData.sub_domain_name,
    questionData.kompetensi_id,
    questionData.kompetensi_name,
    questionData.question_type_id,
    questionData.question_type_name,
    questionData.data,
    questionData.question,
    questionData.pembahasan,
  ];

  // bikin placeholder $1, $2, dst sesuai jumlah kolom
  const placeholders = values.map((_, i) => `$${i + 1}`).join(',');

  const queryString = `
    INSERT INTO question (${columns.join(', ')})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const result = await query(queryString, values);
  return result.rows[0];
};

export const getQuestionsByTestId = async (testId: string) => {
  const queryString = `SELECT * FROM question WHERE test_id = $1 ORDER BY created_at ASC;`;
  const result = await query(queryString, [testId]);
  return result.rows;
};

export const createQuestionType = async (name: string) => {
  const queryString = `
    INSERT INTO question_type (name)
    VALUES ($1)
    RETURNING *;
  `;
  const result = await query(queryString, [name]);
  return result.rows[0];
};

export const getAllQuestionTypes = async () => {
  const queryString = `SELECT * FROM question_type ORDER BY name ASC;`;
  const result = await query(queryString);
  return result.rows;
};

export const createSavedQuestion = async (no_identitas: string, question_id: string) => {
  const queryStringCheck = `SELECT * FROM saved_question sq WHERE sq.no_identitas = $1 AND sq.question_id = $2`;
  const resultCheck = await query(queryStringCheck, [no_identitas, question_id]);
  if (resultCheck.rowCount && resultCheck.rowCount > 0) {
    const queryString = `DELETE FROM saved_question sq WHERE sq.no_identitas = $1 AND sq.question_id = $2 RETURNING *`;
    const result = await query(queryString, [no_identitas, question_id]);
    return { ...result.rows[0], isDeleted: true };
  } else {
    const queryString = `INSERT INTO saved_question (no_identitas, question_id) VALUES ($1, $2) RETURNING *`;
    const result = await query(queryString, [no_identitas, question_id]);
    return { ...result.rows[0], isDeleted: false };
  }
};

export const getSavedQuestrionByUserId = async (
  no_identitas: string,
  limit?: number,
  offset?: number
) => {
  const pagelimit = limit ?? 5;
  const pageOffset = offset ?? 0;

  // Query untuk data terbatas (5 row)
  const dataQuery = `
    SELECT sq.id AS saved_id, q.* 
    FROM saved_question sq 
    LEFT JOIN question q ON sq.question_id = q.id 
    WHERE sq.user_id = $1 
    ORDER BY sq.id DESC 
    LIMIT $2 OFFSET $3
  `;

  // Query untuk hitung total data
  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM saved_question sq 
    WHERE sq.user_id = $1
  `;

  const dataResult = await query(dataQuery, [no_identitas, pagelimit, pageOffset]);
  const countResult = await query(countQuery, [no_identitas]);

  return {
    length: parseInt(countResult.rows[0].total, 10),
    data: dataResult.rows,
  };
};
