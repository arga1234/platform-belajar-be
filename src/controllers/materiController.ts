import { Request, Response } from 'express';
import * as materiService from '../services/materiService';

export const createMateriByKompetensi = async (req: Request, res: Response) => {
  try {
    const { name, kompetensi_id, point } = req.body;
    if (!name || !kompetensi_id || point) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }
    const materi = await materiService.createMateriByKompetensi(name, kompetensi_id, point);
    res.status(201).json(materi);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMateriByKompetensi = async (req: Request, res: Response) => {
  try {
    const { kompetensiId } = req.params;
    const materi = await materiService.getMateriByKompetensi(kompetensiId);
    res.json(materi);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createMateriContent = async (req: Request, res: Response) => {
  try {
    const { materiId } = req.params;
    const { content, order_number } = req.body;
    if (!content || order_number === undefined) {
      return res.status(400).json({ message: 'Content dan order_number wajib diisi' });
    }
    const materiContent = await materiService.createMateriContent(materiId, content, order_number);
    res.status(201).json(materiContent);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMateriContent = async (req: Request, res: Response) => {
  try {
    const { materiId } = req.params;
    const result = await materiService.getMateriContent(materiId);
    res.json(result); // { data, totalPage }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createDoneMateri = async (req: Request, res: Response) => {
  try {
    const result = await materiService.createDoneMateri(req.body);
    return res.status(201).json({
      message: 'Data berhasil dibuat',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getDoneMateri = async (req: Request, res: Response) => {
  try {
    const { user_id, kompetensi_id } = req.params;
    const result = await materiService.getDoneMateri(user_id, kompetensi_id);
    return res.status(200).json({
      message: 'Daftar materi selesai berhasil diambil',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
