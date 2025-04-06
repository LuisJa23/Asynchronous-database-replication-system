// src/services/logService.ts (Versión Corregida)
import { getSQLAdminClient } from '../config/googleConfig';

interface EnableBinLogParams {
  projectId: string;
  instanceId: string;
}

export const enableBinaryLogging = async (params: EnableBinLogParams) => {
  const { projectId, instanceId } = params;
  const sqladmin = await getSQLAdminClient();

  // Paso 1: Obtener la configuración actual
  const currentInstance = await sqladmin.instances.get({
    project: projectId,
    instance: instanceId
  });

  // Paso 2: Construir cuerpo de actualización con versión
  const updateBody = {
    settings: {
      ...currentInstance.data.settings, // Mantener config existente
      backupConfiguration: {
        enabled: true,
        binaryLogEnabled: true,
        startTime: "00:00",
        location: "us" // Nuevo parámetro requerido
      },
      settingsVersion: String(currentInstance.data.settings?.settingsVersion ?? 0) // Clave crítica
    }
  };

  try {
    // Paso 3: Ejecutar actualización
    const res = sqladmin.instances.update({
      project: projectId,
      instance: instanceId,
      requestBody: updateBody
    });
    
    return (await res).data;
  } catch (error) {
    console.error('Detalles completos del error:', JSON.stringify(error, null, 2));
    throw new Error(`Error actualizando instancia: ${(error as any).response?.data?.error?.message}`);
  }
};