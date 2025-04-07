// src/services/replicaService.ts
import { getSQLAdminClient } from '../config/googleConfig';

interface CreateReplicaParams {
  projectId: string;
  replicaName: string;
  region?: string;
  tier?: string;
}

export const createReadReplica = async (params: CreateReplicaParams) => {
  const { projectId, replicaName, region = 'us-central1', tier = 'db-f1-micro' } = params;
  
  const sqladmin = await getSQLAdminClient();

  // Nombre de la instancia maestra (quemado por ahora)
  const masterInstanceName = 'database-main-laboratory';

  // Cuerpo de la petición para réplica
  const replicaBody = {
    name: replicaName,
    masterInstanceName: `${projectId}:${region}:${masterInstanceName}`,
    region: region,
    settings: {
      tier: tier,
      replicationType: 'SYNCHRONOUS'
    }
  };

  try {
    const res = await sqladmin.instances.insert({
      project: projectId,
      requestBody: replicaBody
    });
    
    return res.data;
  } catch (error) {
    console.error('Error al crear la réplica:', error);
    if (error instanceof Error) {
      throw new Error(`Error de Cloud SQL: ${(error as any).response?.data?.error?.message || error.message}`);
    } else {
      throw new Error('Error de Cloud SQL: Error desconocido');
    }
  }
};