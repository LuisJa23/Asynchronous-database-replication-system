import mysql from 'mysql2/promise';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import dotenv from 'dotenv';

dotenv.config();

// Variables para la conexión
const DB_USER = process.env.DB_USER || 'javier1';
const DB_PASS = process.env.DB_PASSWORD || '1123';
const DB_NAME = 'products_db';
const INSTANCE_CONNECTION_NAME = process.env.INSTANCE_CONNECTION_NAME || ''; // proyecto:region:instancia

let pool: mysql.Pool | null = null;

async function createPool() {
  if (pool) {
    return pool;
  }

  // Determinar tipo de conexión basado en entorno
  if (INSTANCE_CONNECTION_NAME) {
    // Conexión a través del conector de Cloud SQL
    try {
      console.log('Conectando a través del conector de Cloud SQL');
      const connector = new Connector();
      const clientOpts = await connector.getOptions({
        instanceConnectionName: INSTANCE_CONNECTION_NAME,
        ipType: IpAddressTypes.PUBLIC,
      });

      pool = mysql.createPool({
        ...clientOpts,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        connectionLimit: 10,
        connectTimeout: 30000,
      });
      
      return pool;
    } catch (err) {
      console.error('Error al crear pool con conector:', err);
      throw err;
    }
  } else {
    // Conexión directa usando IP pública
    console.log('Conectando a través de IP pública');
    pool = mysql.createPool({
      host: '34.136.172.75', 
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 60000,
    });
    
    return pool;
  }
}

// Función para obtener el pool
export async function getPool() {
  if (!pool) {
    pool = await createPool();
  }
  return pool;
}

// Export default para mantener compatibilidad
export default {
  execute: async (...args: Parameters<mysql.Pool['execute']>) => {
    const pool = await getPool();
    return pool.execute(...args);
  },
  query: async (...args: Parameters<mysql.Pool['query']>) => {
    const pool = await getPool();
    return pool.query(...args);
  }
};