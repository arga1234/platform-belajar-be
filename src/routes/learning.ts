import { Router } from 'express';
import {
  getAllDomain,
  getAllSubDomain,
  getAllKompetensi,
  getSubDomainByDomainId,
  getKompetensiBySubDomainAndKelas,
} from '../controllers/learningController';
import { authenticate } from '../middleware/authenticate';
const learningRoutes = Router();

// DOMAIN
learningRoutes.get('/domain', getAllDomain);

// SUBDOMAIN
learningRoutes.get('/sub-domain', authenticate, getAllSubDomain);
learningRoutes.get('/sub-domain/:domain_id', authenticate, getSubDomainByDomainId);

// KOMPETENSI
learningRoutes.get('/kompetensi', authenticate, getAllKompetensi);
learningRoutes.get(
  '/kompetensi/:sub_domain_id/:kelas_id',
  authenticate,
  getKompetensiBySubDomainAndKelas
);

export default learningRoutes;
