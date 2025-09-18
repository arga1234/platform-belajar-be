// src/controllers/storageController.ts
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import * as imageService from '../services/imageService';

/**
 * Upload handler yang otomatis menyimpan record ke DB
 *
 * - menerima multipart/form-data:
 *   - file field: "image"
 *   - optional fields: "parent_id", "name"
 * - menyimpan path-only ke DB (mis: /api/storage/testImages/<filename>)
 * - jika insert DB gagal, file akan dihapus (cleanup)
 */
export const uploadHandler = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded. Field name must be 'image'." });
    }

    const BASE_API = process.env.BASE_API || '/api';
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    // path-only untuk disimpan di DB
    const publicPath = `${BASE_API}/storage/testImages/${file.filename}`;
    const fullUrl = `${baseUrl}${publicPath}`;

    // data optional dari form fields (multer akan menaruh text fields di req.body)
    const parent_id = (req.body?.parent_id as string) ?? null;
    const name = (req.body?.name as string) ?? file.originalname;

    // coba simpan ke DB
    let createdRecord;
    try {
      createdRecord = await imageService.createImageRecord(parent_id, publicPath, name);
    } catch (dbErr) {
      // jika gagal insert ke DB, hapus file yang sudah terupload untuk konsistensi
      try {
        const testImagesDir = path.resolve(process.cwd(), 'testImages');
        const filePath = path.resolve(testImagesDir, file.filename);
        // safety: pastikan filePath ada di folder testImages
        if (filePath.startsWith(testImagesDir + path.sep) || filePath === testImagesDir) {
          await fs.unlink(filePath).catch(() => {
            /* ignore */
          });
        }
      } catch (cleanupErr) {
        console.error('Cleanup failed:', cleanupErr);
      }

      console.error('DB insert failed:', dbErr);
      return res.status(500).json({ message: 'Failed to save record to DB', error: String(dbErr) });
    }

    // sukses: kembalikan info file + record (url penuh untuk convenience)
    return res.status(201).json({
      message: 'File uploaded and record saved',
      file: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      record: {
        ...createdRecord,
        url: fullUrl, // convenience: full url sesuai host sekarang
        stored_path: createdRecord.url, // path-only seperti tersimpan di DB
      },
    });
  } catch (err: any) {
    console.error('uploadHandler error:', err);
    return res.status(500).json({ message: err?.message ?? 'Internal server error' });
  }
};

export default { uploadHandler };
