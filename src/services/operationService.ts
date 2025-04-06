// src/services/operationService.ts
import { getSQLAdminClient } from '../config/googleConfig';

interface CheckOperationParams {
  projectId: string;
  operationId: string;
}

export const checkOperationStatus = async (params: CheckOperationParams) => {
  const { projectId, operationId } = params;
  const sqladmin = await getSQLAdminClient();

  try {
    const res = await sqladmin.operations.get({
      project: projectId,
      operation: operationId
    });
    
    return {
      status: res.data.status,
      error: res.data.error?.errors || null,
      startTime: res.data.insertTime,
      endTime: res.data.endTime,
      operationType: res.data.operationType
    };
  } catch (error) {
    throw new Error(`Error consultando operación: ${(error as any).response?.data?.error?.message}`);
  }
};