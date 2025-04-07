import { getSQLAdminClient } from '../config/googleConfig';
import { DatabaseConnection } from '../config/data-source';
import { Instance } from '../models/instance';
import { QueryRunner } from 'typeorm';

interface ReplicaOperationResult {
  cloudOperation: {
    id: string;
    status: string;
    startTime: string;
  };
  localInstance: Instance;
}

interface CloudSQLOperation {
  name: string;
  status: string;
  startTime: string;
  error?: any;
}

export class ReplicaService {
  private static readonly MASTER_INSTANCE = 'database-main-laboratory';
  private static readonly REQUIRED_REGIONS = ['us-central1', 'europe-west1'];
  private static readonly ALLOWED_TIERS = ['db-f1-micro', 'db-g1-small'];

  public static async createReplica(
    projectId: string,
    replicaName: string,
    region: string = 'us-central1',
    tier: string = 'db-f1-micro'
  ): Promise<ReplicaOperationResult> {
    const queryRunner: QueryRunner = DatabaseConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validación de parámetros
      this.validateInputParameters(projectId, replicaName, region, tier);

      // Crear réplica en Cloud SQL
      const cloudOperation = await this.createCloudReplica(
        projectId,
        replicaName,
        region,
        tier
      );

      // Registrar en base de datos local
      const localInstance = await this.createLocalRecord(queryRunner, replicaName);

      await queryRunner.commitTransaction();

      return {
        cloudOperation: {
          id: cloudOperation.name,
          status: cloudOperation.status,
          startTime: cloudOperation.startTime
        },
        localInstance
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw this.handleServiceError(error);
    } finally {
      await queryRunner.release();
    }
  }

  private static validateInputParameters(
    projectId: string,
    replicaName: string,
    region: string,
    tier: string
  ): void {
    const errors: string[] = [];

    if (!projectId.match(/^[a-z][a-z0-9-]{5,29}$/)) {
      errors.push('Project ID inválido');
    }

    if (!replicaName.match(/^[a-z][a-z0-9-]{1,61}[a-z0-9]$/)) {
      errors.push('Nombre de réplica inválido');
    }

    if (!this.REQUIRED_REGIONS.includes(region)) {
      errors.push(`Región no permitida: ${region}`);
    }

    if (!this.ALLOWED_TIERS.includes(tier)) {
      errors.push(`Tier no permitido: ${tier}`);
    }

    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(', ')}`);
    }
  }

  private static async createCloudReplica(
    projectId: string,
    replicaName: string,
    region: string,
    tier: string
  ): Promise<CloudSQLOperation> {
    try {
      const sqladmin = await getSQLAdminClient();

      const response = await sqladmin.instances.insert({
        project: projectId,
        requestBody: {
          name: replicaName,
          masterInstanceName: `${projectId}:${region}:${this.MASTER_INSTANCE}`,
          region: region,
          settings: {
            tier: tier,
            replicationType: 'SYNCHRONOUS',
            availabilityType: 'REGIONAL'
          }
        }
      });

      return {
        name: response.data.name || '',
        status: response.data.status || 'UNKNOWN',
        startTime: response.data.insertTime || new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error en Cloud SQL: ${this.extractCloudError(error)}`);
    }
  }

  private static async createLocalRecord(
    queryRunner: QueryRunner,
    replicaName: string
  ): Promise<Instance> {
    try {
      const instance = queryRunner.manager.create(Instance, {
        name: replicaName,
        isMain: false,
        isOk: true
      });

      return await queryRunner.manager.save(instance);
    } catch (error) {
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new Error(`La réplica ${replicaName} ya existe`);
      }
      throw new Error('Error al guardar en base de datos local');
    }
  }

  private static extractCloudError(error: any): string {
    if (error?.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    return error.message || 'Error desconocido en Cloud SQL';
  }

  private static handleServiceError(error: unknown): Error {
    if (error instanceof Error) {
      console.error('Service Error:', {
        message: error.message,
        stack: error.stack
      });
      return error;
    }
    return new Error('Error desconocido en el servicio de réplicas');
  }
}
