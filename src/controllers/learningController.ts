import { Request, Response } from 'express';
import { query } from '../db';

// DOMAIN
export const getAllDomain = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name, description FROM domain ORDER BY name');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// SUBDOMAIN
export const getAllSubDomain = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name, domain_id FROM "subDomain" ORDER BY name');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubDomainByDomainId = async (req: Request, res: Response) => {
  try {
    const { domain_id } = req.params;
    const result = await query(
      'SELECT id, name FROM "subDomain" WHERE domain_id=$1 ORDER BY name',
      [domain_id]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// KOMPETENSI
export const getAllKompetensi = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, name, domain_id, kelas_id, sub_domain_id FROM kompetensi ORDER BY name'
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getKompetensiBySubDomainAndKelas = async (req: Request, res: Response) => {
  try {
    const { sub_domain_id, kelas_id } = req.params;
    const result = await query(
      'SELECT id, name FROM kompetensi WHERE sub_domain_id=$1 AND kelas_id=$2 ORDER BY name',
      [sub_domain_id, kelas_id]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
