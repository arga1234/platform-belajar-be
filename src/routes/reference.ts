import { Router } from 'express';
import {
  getAllKelas,
  getAllRole,
  getAllSekolah,
  getSekolahByName,
} from '../controllers/referenceController';

const referenceRoute = Router();

// pasang authenticate untuk semua route

// KELAS
referenceRoute.get('/kelas', getAllKelas);

// ROLE
referenceRoute.get('/role', getAllRole);

// SEKOLAH
referenceRoute.get('/sekolah', getAllSekolah);
referenceRoute.get('/sekolah/search', getSekolahByName);

export default referenceRoute;
