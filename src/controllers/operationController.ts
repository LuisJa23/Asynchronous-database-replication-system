// src/controllers/operationController.ts
import { Request, Response } from 'express';
import { checkOperationStatus } from '../services/operationService';

export const getOperationStatus = async (req: Request, res: Response) => {
  try {
    const { projectId, operationId } = req.params;

    if (!projectId || !operationId) {
      return res.status(400).json({
        error: 'Parámetros requeridos en URL: projectId, operationId'
      });
    }

    const status = await checkOperationStatus({ projectId, operationId });

    res.status(200).json({
      operationId,
      estado: status.status || 'ESTADO_DESCONOCIDO',
      tipoOperacion: status.operationType,
      duracion: status.endTime 
        ? `${(new Date(status.endTime ?? 0).getTime() - new Date(status.startTime ?? 0).getTime()) / 1000} segundos`
        : 'EN_PROGRESO',
      errores: status.error
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al consultar operación',
      details: (error as Error).message,
      solution: 'Verificar formato del operationId: operations/abcd-1234'
    });
  }
};