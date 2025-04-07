// src/services/instanceService.ts
import { getSQLAdminClient } from '../config/googleConfig';
import { DatabaseConnection } from '../config/data-source';
import { Instance } from '../models/instance';

interface CreateInstanceParams {
  projectId: string;
  instanceId: string;
  region: string;
  tier: string;
  databaseVersion: string;
}

export const createCloudSQLInstance = async (params: CreateInstanceParams) => {
  const { projectId, instanceId, region, tier, databaseVersion } = params;
  const sqladmin = await getSQLAdminClient();

  const instanceBody = {
    name: instanceId,
    region,
    databaseVersion,
    settings: {
      tier,
    },
  };

  try {
    const repository = DatabaseConnection.getInstance().getRepository(Instance);
    const existingInstance = await repository.findOne({ where: { name: instanceId } });
    if (existingInstance) {
      console.log('La instancia ya existe en la base de datos.');
      return existingInstance;
    }

    const res = await sqladmin.instances.insert({
      project: projectId,
      requestBody: instanceBody,
    });

    // Guardar el nombre de la instancia en la base de datos
    const newInstance = repository.create({
      name: instanceId,
      isMain: true, // o false, dependiendo de si es la principal
      isOk: true     // o false, si esta pendiente de verificacion
    });
    
    await repository.save(newInstance);
    return res.data;
  } catch (error) {
    console.error('Error al crear la instancia:', error);
    throw error;
  }
};