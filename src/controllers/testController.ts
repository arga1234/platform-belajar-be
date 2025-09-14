import { Request, Response } from 'express';
import * as testService from '../services/testService';

export const createTest = async (req: Request, res: Response) => {
  try {
    const { name, parent_id, live_at, live_end, test_type_id, jumlah_soal, durasi_seconds } =
      req.body;

    if (!name || !test_type_id) {
      return res.status(400).json({ message: 'Name and test_type_id are required' });
    }

    const newTest = await testService.createTest({
      name,
      parent_id,
      live_at,
      test_type_id,
      live_end,
      jumlah_soal,
      durasi_seconds,
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

export const createTestType = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name wajib diisi' });
    }

    const testType = await testService.createTestType(name);
    res.status(201).json({ message: 'Test type created', data: testType });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTestTypes = async (req: Request, res: Response) => {
  try {
    const types = await testService.getAllTestTypes();
    res.status(200).json({ data: types });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createHasilCapaian = async (req: Request, res: Response) => {
  try {
    const newData = await testService.createHasilCapaian(req.body);
    res.status(201).json(newData);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error creating hasil capaian', error: error.message });
  }
};

export const getHasilCapaianByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const data = await testService.getHasilCapaianByUserId(userId);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching hasil capaian', error: error.message });
  }
};

export const getHasilCapaianByUserIdAndTestId = async (req: Request, res: Response) => {
  try {
    const { userId, testId } = req.params;
    const data = await testService.getHasilCapaianByUserIdAndTestId(userId, testId);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching hasil capaian', error: error.message });
  }
};

export async function getHasilCapaianByTestId(req: Request, res: Response): Promise<Response> {
  try {
    const { testId } = req.params;

    if (!testId) {
      return res.status(400).json({ message: 'test_id not defined' });
    }

    const data = await testService.getHasilCapaianByTestId(testId);

    return res.json(data);
  } catch (error) {
    console.error('Error fetching hasil_capaian:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function getHasilCapaianDetailById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'id not defined' });
    }
    const data = await testService.getHasilCapaianDetailById(id);
    return res.json(data);
  } catch (error) {
    console.error('Error fetching hasil_capaian detail:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getHasilCapaianByUserIdAndTestTypeId = async (req: Request, res: Response) => {
  try {
    const { userId, testTypeId } = req.params;
    const data = await testService.getHasilCapaianByUserIdAndTestTypeId(userId, testTypeId);
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching hasil capaian', error: error.message });
  }
};
