// src/app.ts
import express from 'express';
import instanceRoutes from './routes/routes';
import 'dotenv/config';
import "reflect-metadata"
import { DatabaseConnection } from './config/data-source';
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', instanceRoutes);

const PORT = process.env.PORT || 3000;

// Function to initialize the database
async function initializeDatabase(): Promise<void> {
  try {
    await DatabaseConnection.initialize();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
    process.exit(1);
  }
}

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await initializeDatabase(); // Inicializa la base de datos al arrancar el servidor
});
