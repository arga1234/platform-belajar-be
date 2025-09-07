import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecretkey123';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token dibutuhkan' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // simpan info user di request
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
};
