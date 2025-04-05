import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

// Definimos el tipo IPType localmente ya que no se exporta desde el módulo.
type IPType = 'PRIVATE' | 'PUBLIC';

interface DbEnv {
  INSTANCE_CONNECTION_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  PRIVATE_IP?: string;
}

// Función para determinar el tipo de IP (pública o privada)
const getIpType = (): IPType => {
  return process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true'
    ? 'PRIVATE'
    : 'PUBLIC';
};

// Función principal para conectar a Cloud SQL usando el conector
export const connectWithConnector = async (
  config: PoolOptions = {}
): Promise<Pool> => {
  const {
    INSTANCE_CONNECTION_NAME,
    DB_USER,
    DB_PASS,
    DB_NAME
  } = process.env as NodeJS.ProcessEnv & DbEnv;

  if (!INSTANCE_CONNECTION_NAME || !DB_USER || !DB_PASS || !DB_NAME) {
    throw new Error('Faltan variables de entorno requeridas');
  }

  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: INSTANCE_CONNECTION_NAME,
    ipType: getIpType() as unknown as IpAddressTypes
  });

  const dbConfig: PoolOptions = {
    ...clientOpts,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    ...config
  };

  return mysql.createPool(dbConfig);
};
