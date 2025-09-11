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

// const shuffleArray = <T>(array: T[]): T[] => {
//   const copy = [...array];
//   for (let i = copy.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [copy[i], copy[j]] = [copy[j], copy[i]];
//   }
//   return copy;
// };

// export const getQuestionsByTestId = async (testId: string) => {
//   const queryString = `SELECT * FROM question WHERE test_id = $1 ORDER BY id ASC;`;
//   const result = await query(queryString, [testId]);
//   const questions = result.rows;

//   // 1. Group berdasarkan content_id
//   const grouped: Record<string, any[]> = {};
//   const noContent: any[] = [];

//   for (const q of questions) {
//     if (q.content_id) {
//       if (!grouped[q.content_id]) grouped[q.content_id] = [];
//       grouped[q.content_id].push(q);
//     } else {
//       noContent.push(q);
//     }
//   }

//   // 2. Buat list grup (array of array) + soal tanpa content_id (single array)
//   const blocks: any[][] = [
//     ...Object.values(grouped), // grup soal
//     ...noContent.map((q) => [q]), // soal tunggal
//   ];

//   // 3. Shuffle antar blok
//   const shuffledBlocks = shuffleArray(blocks);

//   // 4. Flatten hasil akhir
//   return shuffledBlocks.flat();
// };
