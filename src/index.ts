import 'dotenv/config';
import { connectWithConnector } from './db/cloudSqlConnector';

(async () => {
  try {
    const pool = await connectWithConnector();
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('¡Conexión exitosa! Hora del servidor:', (rows as any)[0].now);
  } catch (err) {
    console.error('Error en la conexión:', err);
  }
})();
