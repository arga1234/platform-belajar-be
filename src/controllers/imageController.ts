// src/controllers/imageController.ts
import { Request, Response } from 'express';
import * as imageService from '../services/imageService';
import { ImageRecord } from '../types/image';

/**
 * Helper: normalisasi url yang akan disimpan (path-only)
 * - full URL -> simpan pathname + search + hash
 * - startsWith('/') -> simpan apa adanya
 * - else treat as filename -> /api/storage/testImages/<filename>
 */
const BASE_API = process.env.BASE_API || '/api';

function toStoredPath(input: string): string {
  if (!input) return input;
  // trim
  const url = input.trim();

  // if starts with http/https -> parse and return pathname + search + hash
  if (/^https?:\/\//i.test(url)) {
    try {
      const u = new URL(url);
      return (u.pathname || '') + (u.search || '') + (u.hash || '');
    } catch (err) {
      // fallback: if URL constructor fails, continue to other checks
    }
  }

  // if already absolute path
  if (url.startsWith('/')) {
    return url;
  }

  // otherwise treat as filename and prefix the storage path
  // ensures it becomes /api/storage/testImages/<filename>
  return `${BASE_API}/storage/testImages/${url}`;
}

function toFullUrl(req: Request, storedPath: string): string {
  // storedPath must be path-only starting with /...; if not, ensure leading slash
  const pathOnly = storedPath.startsWith('/') ? storedPath : `/${storedPath}`;
  const host = req.get('host');
  const protocol = req.protocol;
  return `${protocol}://${host}${pathOnly}`;
}

/**
 * POST /api/images
 * body: { parent_id?: string, url: string, name?: string }
 * - accepts full url, path, or filename
 * - stores path-only in DB
 */
export const createImage = async (req: Request, res: Response) => {
  try {
    const { parent_id, url, name } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'url is required in body' });
    }

    const storedPath = toStoredPath(url);
    const record: ImageRecord = await imageService.createImageRecord(
      parent_id ?? null,
      storedPath,
      name ?? null
    );

    // return record + full url for convenience
    const fullUrl = toFullUrl(req, record.url);
    return res.status(201).json({ ...record, url: fullUrl, stored_path: record.url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

/**
 * GET /api/images?parent_id=<uuid>
 * returns list with url full (host saat ini)
 */
export const listImagesByParent = async (req: Request, res: Response) => {
  try {
    const parent_id = req.query.parent_id as string | undefined;
    if (!parent_id) {
      return res.status(400).json({ message: 'query param parent_id is required' });
    }
    const rows = await imageService.getImagesByParentId(parent_id);

    // map to include full url according to current host
    const mapped = rows.map((r) => {
      const fullUrl = toFullUrl(req, r.url);
      return {
        id: r.id,
        parent_id: r.parent_id,
        name: r.name,
        url: fullUrl, // full URL for client
        stored_path: r.url, // path-only as stored in DB
      };
    });

    return res.json(mapped);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

/**
 * GET /api/images/:id/link
 * redirect ke file (full url pada host saat ini)
 */
export const getImageLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await imageService.getImageById(id);
    if (!record) return res.status(404).json({ message: 'Image not found' });

    const fullUrl = toFullUrl(req, record.url);
    return res.redirect(fullUrl);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
};
