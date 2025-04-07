// src/routes/routes.ts
import { Router } from 'express';
import { createInstance } from '../controllers/instanceController';
import { createReplica } from '../controllers/replicaController';
import { enableBinlog } from '../controllers/logController';
import { getOperationStatus } from '../controllers/operationController';
import { checkInstance } from '../controllers/healthCheckController';

const router = Router();

router.post('/instances', async (req, res, next) => {
  try {
    await createInstance(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/replicas', async (req, res, next) => {
  try {
    await createReplica(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/enable-binlog', async (req, res, next) => {
  try {
    await enableBinlog(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/operations/:projectId/:operationId', async (req, res, next) => {
  try {
    await getOperationStatus(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/health-check/:name', async (req, res, next) => {
  try {
    await checkInstance(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;