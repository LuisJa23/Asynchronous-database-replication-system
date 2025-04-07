import 'dotenv/config';
import express from 'express';
import { DatabaseConnection } from './config/data-source';
import router from './routes/routes';
import { ReplicaController } from './controllers/replicaController';

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api', router);

// Middleware global de manejo de errores
app.use(ReplicaController.errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await DatabaseConnection.initialize();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  await DatabaseConnection.shutdown();
  process.exit(0);
});
