import { Router } from 'express';
import { createInstance } from '../controllers/instanceController';
import { ReplicaController } from '../controllers/replicaController';
import { enableBinlog } from '../controllers/logController';
import { getOperationStatus } from '../controllers/operationController';
import { checkInstance } from '../controllers/healthCheckController';
import { ProductController } from '../controllers/productController';

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
    await ReplicaController.createReplica(req, res, next);
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

// Rutas de productos
router.post('/products', async (req, res, next) => {
  try {
    await ProductController.createProduct(req, res, next);
  } catch (error) {
    next(error);
  }
});

// router.get('/products', async (req, res, next) => {
//   try {
//     await ProductController.getAllProducts(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// });

router.get('/products/:id', async (req, res, next) => {
  try {
    await ProductController.getProductById(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;