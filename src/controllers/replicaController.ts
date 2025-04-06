// src/controllers/replicaController.ts
import { Request, Response } from 'express';
import { createReadReplica } from '../services/replicaService';

export const createReplica = async (req: Request, res: Response) => {
  const { projectId, replicaName } = req.body;

  if (!projectId || !replicaName) {
    return res.status(400).json({ 
      error: 'Parámetros requeridos faltantes',
      details: 'Debes proporcionar projectId y replicaName' 
    });
  }

  try {
    const result = await createReadReplica({
      projectId,
      replicaName
    });

    res.status(202).json({
      message: 'Réplica en proceso de creación',
      operationId: result.name,
      details: `Réplica ${replicaName} se está creando como réplica de database-main-laboratory`
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear réplica',
      details: (error as Error).message,
      solution: 'Verifica que la instancia maestra existe y está en estado RUNNABLE'
    });
  }
};