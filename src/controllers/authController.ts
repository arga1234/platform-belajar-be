import { Request, Response } from 'express';
import { registerUser, loginUser, getProfile } from '../services/authService';
import { LoginDto, RegisterDto } from '../types/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const data: RegisterDto = req.body;
    const user = await registerUser(data);
    res.status(201).json({ message: 'User berhasil dibuat', user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginDto = req.body;
    const result = await loginUser(data);
    res.status(200).json({ message: 'Login berhasil', token: result.token, user: result.user });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getProfileController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await getProfile(userId);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
