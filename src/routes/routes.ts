// src/routes/routes.ts
import { Router } from 'express';
import { createInstance } from '../controllers/instanceController';

const router = Router();

router.post('/instances', async (req, res, next) => {
  try {
    await createInstance(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;