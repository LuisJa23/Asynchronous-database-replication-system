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
      ipConfiguration: {
        ipv4Enabled: true,
      },
    },
  };

  try {
    const repository = DatabaseConnection.getInstance().getRepository(Instance);
    const existingInstance = await repository.findOne({ where: { name: instanceId } });
    if (existingInstance) {
      console.log('Instance already exists in database');
      return existingInstance;
    }

    // 1. Crear instancia en Cloud SQL
    console.log('Creating Cloud SQL instance...');
    const res = await sqladmin.instances.insert({
      project: projectId,
      requestBody: instanceBody,
    });

    // 2. Guardar primero en la base de datos local con IP y región como null
    const newInstance = repository.create({
      name: instanceId,
      isMain: true,
      isOk: true, // Marcamos como no lista aún
      publicIp: null,
      region: region
    });

    await repository.save(newInstance);
    console.log('Temporary instance record created in local database');

    // 3. Retornar la respuesta de Google sin esperar
    return {
      cloudOperation: res.data,
      localInstance: newInstance
    };

  } catch (error) {
    console.error('Error creating instance:', error);
    throw error;
  }
};

// ✅ Nuevo método: Obtener la instancia principal
export const getMainInstance = async (): Promise<Instance | null> => {
  try {
    const repository = DatabaseConnection.getInstance().getRepository(Instance);
    return await repository.findOne({ where: { isMain: true } });
  } catch (error) {
    console.error('Error al obtener la instancia principal:', error);
    throw error;
  }
};