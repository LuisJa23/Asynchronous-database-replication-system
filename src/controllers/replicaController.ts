import { Request, Response, NextFunction } from 'express';
import { ReplicaService } from '../services/replicaService';
import { Instance } from '../models/instance';

export class ReplicaController {
  public static async createReplica(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { projectId, replicaName, region, tier } = req.body;

      if (!projectId || !replicaName) {
        throw new Error('projectId y replicaName son requeridos');
      }

      const result = await ReplicaService.createReplica(
        projectId,
        replicaName,
        region,
        tier
      );

      res.status(201).json({
        success: true,
        operation: result.cloudOperation,
        instance: this.formatInstanceResponse(result.localInstance),
        links: this.generateLinks(projectId, replicaName)
      });
    } catch (error) {
      next(error);
    }
  }

  private static formatInstanceResponse(instance: Instance) {
    return {
      id: instance.id,
      name: instance.name,
      status: instance.isOk ? 'healthy' : 'unhealthy',
      role: instance.isMain ? 'primary' : 'replica',
      createdAt: instance.createdAt
    };
  }

  private static generateLinks(projectId: string, replicaName: string) {
    return {
      self: `/api/replicas/${replicaName}`,
      status: `https://console.cloud.google.com/sql/instances/${replicaName}/overview?project=${projectId}`,
      operations: `/api/operations/${projectId}/${replicaName}`
    };
  }

  // Middleware centralizado de manejo de errores
  public static errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error('Controller Error:', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      type: 'InternalServerError',
      message: err.message || 'Error interno del servidor'
    });
  }
}
