import { Request, Response } from 'express';
import { query } from '../db';

// KELAS
export const getAllKelas = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, tingkat FROM kelas ORDER BY tingkat');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ROLE
export const getAllRole = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name FROM role ORDER BY name');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// SEKOLAH
export const getAllSekolah = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name FROM sekolah ORDER BY name');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSekolahByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string')
      return res.status(400).json({ error: 'Parameter name wajib diisi' });

    const result = await query('SELECT id, name FROM sekolah WHERE name ILIKE $1 ORDER BY name', [
      `%${name}%`,
    ]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
