// src/services/instanceService.ts
import { getSQLAdminClient } from '../config/googleConfig';

interface CreateInstanceParams {
  projectId: string;
  instanceId: string;  // Cambiado de instanceName a instanceId
  region: string;
  tier: string;        // Quitamos el opcional
  databaseVersion: string; // Quitamos el opcional
}

export const createCloudSQLInstance = async (params: CreateInstanceParams) => {
  const { projectId, instanceId, region, tier, databaseVersion } = params;
  const sqladmin = await getSQLAdminClient();

  const instanceBody = {
    name: instanceId,
    region,
    databaseVersion,
    settings: {
      tier // Mantenemos solo los parámetros oficiales requeridos
    }
  };

  try {
    const res = await sqladmin.instances.insert({
      project: projectId,
      requestBody: instanceBody
    });
    return res.data;
  } catch (error) {
    console.error('Error al crear la instancia:', error);
    throw error;
  }
};