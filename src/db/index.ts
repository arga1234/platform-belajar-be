import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// helper query
export const query = (text: string, params?: any[]) => pool.query(text, params);
