import { Request, Response } from 'express';
import * as contentService from '../services/contentService';

export const createContent = async (req: Request, res: Response) => {
  try {
    const { data, test_id } = req.body;
    if (!data || !test_id) {
      return res.status(400).json({ message: 'data dan test_id wajib diisi' });
    }

    const content = await contentService.createContent(data, test_id);
    res.status(201).json({ message: 'Content created successfully', data: content });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getContentsByTestId = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    if (!testId) {
      return res.status(400).json({ message: 'testId wajib diisi' });
    }

    const contents = await contentService.getContentsByTestId(testId);
    res.status(200).json({ data: contents });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getContentsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'id wajib diisi' });
    }

    const contents = await contentService.getContentsByContentId(id);
    console.log(contents);
    res.status(200).send(contents);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
