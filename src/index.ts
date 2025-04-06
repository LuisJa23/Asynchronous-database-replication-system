// src/app.ts
import express from 'express';
import instanceRoutes from './routes/routes';
import 'dotenv/config';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', instanceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
