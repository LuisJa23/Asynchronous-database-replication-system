import "reflect-metadata";
import 'dotenv/config';
import express from 'express';
import instanceRoutes from './routes/routes';
import { DatabaseConnection } from './config/data-source';
import { ReplicaController } from './controllers/replicaController';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', instanceRoutes);

// Middleware global de manejo de errores
app.use(ReplicaController.errorHandler);

const PORT = process.env.PORT || 3000;

// Función para inicializar la base de datos
async function initializeDatabase(): Promise<void> {
  try {
    await DatabaseConnection.initialize();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
    process.exit(1);
  }
}

// Función para iniciar el servidor
async function startServer(): Promise<void> {
  try {
    await initializeDatabase(); // Inicializa la base de datos antes de arrancar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre controlado
process.on('SIGINT', async () => {
  console.log('Cerrando la aplicación...');
  await DatabaseConnection.shutdown();
  console.log('Conexión a la base de datos cerrada.');
  process.exit(0);
});

// Iniciar el servidor
startServer();