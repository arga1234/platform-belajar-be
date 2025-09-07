import { Request, Response } from 'express';
import * as testService from '../services/testService';

export const createTest = async (req: Request, res: Response) => {
  try {
    const { name, parent_id, live_at, test_type_id } = req.body;

    if (!name || !test_type_id) {
      return res.status(400).json({ message: 'Name and test_type_id are required' });
    }

    const newTest = await testService.createTest({
      name,
      parent_id,
      live_at,
      test_type_id,
    });

    res.status(201).json({ data: newTest });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTestsByParent = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    const tests = await testService.getTestsByParent(parentId);
    res.json({ data: tests });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTestsByType = async (req: Request, res: Response) => {
  try {
    const { testTypeId } = req.params;
    const tests = await testService.getTestsByType(testTypeId);
    res.json({ data: tests });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getNearestTest = async (req: Request, res: Response) => {
  try {
    const { testTypeId } = req.params;
    const test = await testService.getNearestTest(testTypeId);
    res.json({ data: test });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
