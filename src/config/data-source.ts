// src/config/data-source.ts
import 'reflect-metadata';
import { DataSource, ObjectLiteral, Repository, QueryRunner } from 'typeorm';
import { Instance } from '../models/instance';

export class DatabaseConnection {
  static shutdown() {
    throw new Error("Method not implemented.");
  }
  static getRepository(entity: typeof Instance) {
      throw new Error('Method not implemented.');
  }
  // Instancia singleton de DataSource para evitar múltiples conexiones.
  private static instance: DataSource;


  // Constructor privado para forzar el uso del método getInstance().
  private constructor() {}

  /**
   * Retorna la instancia de DataSource.
   * Si no existe, la crea usando la configuración del entorno.
   * @returns Instancia de DataSource.
   */
  public static getInstance(): DataSource {
    if (!this.instance) {
      this.instance = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root123',
        database: 'database_instance',
        entities: [Instance],
        synchronize: true, // Activado solo en desarrollo para sincronizar el esquema
        logging: true
      });
    }
    return this.instance;
  }

  /**
   * Inicializa la conexión a la base de datos.
   * Imprime en consola las entidades configuradas y mapeadas.
   * @throws Error si falla la conexión.
   */
  public static async initialize(): Promise<void> {
    try {
      const dataSource = this.getInstance();
      console.log('Entidades configuradas:', dataSource.options.entities);
      await dataSource.initialize();
      const entities = dataSource.entityMetadatas;
      console.log(
        'Entidades mapeadas:',
        entities.map(e => ({
          name: e.name,
          tableName: e.tableName,
          columns: e.columns.map(c => c.propertyName)
        }))
      );
    
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      
      throw error;
    }
  }
}