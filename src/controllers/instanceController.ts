// src/controllers/instanceController.ts
import { Request, Response } from 'express';
import { createCloudSQLInstance } from '../services/instanceService';

export const createInstance = async (req: Request, res: Response) => {
  try {
    const { projectId, instanceId, region, tier, databaseVersion } = req.body;

    if (!projectId || !instanceId || !region || !tier || !databaseVersion) {
      return res.status(400).json({ 
        message: 'Parámetros requeridos faltantes: projectId, instanceId, region, tier, databaseVersion' 
      });
    }

    const instanceData = await createCloudSQLInstance({
      projectId,
      instanceId,
      region,
      tier,
      databaseVersion
    });

    res.status(201).json({ 
      message: 'Instancia creada exitosamente',
      data: instanceData 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al crear la instancia',
      error: (error as Error).message 
    });
  }
};