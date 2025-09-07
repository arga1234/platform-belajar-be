import { Request, Response } from 'express';
import * as questionService from '../services/questionService';

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuestionsByTestId = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const questions = await questionService.getQuestionsByTestId(testId);
    res.json({ success: true, data: questions });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createQuestionType = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name wajib diisi' });
    }

    const questionType = await questionService.createQuestionType(name);
    res.status(201).json({ message: 'Question type created', data: questionType });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllQuestionTypes = async (req: Request, res: Response) => {
  try {
    const types = await questionService.getAllQuestionTypes();
    res.status(200).json({ data: types });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
