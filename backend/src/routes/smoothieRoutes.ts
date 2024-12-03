import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  getAllSmoothies,
  getSmoothieById,
  createSmoothie,
  updateSmoothie,
  deleteSmoothie,
} from './smoothieHandlers';

const router = Router();
const prisma = new PrismaClient();

router.get('/', getAllSmoothies(prisma));
router.get('/:id', getSmoothieById(prisma));
router.post('/', createSmoothie(prisma));
router.put('/:id', updateSmoothie(prisma));
router.delete('/:id', deleteSmoothie(prisma));

export default router;