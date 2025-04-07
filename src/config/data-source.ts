// src/config/data-source.ts
import 'reflect-metadata';
import { DataSource, ObjectLiteral, Repository, QueryRunner } from 'typeorm';
import { Instance } from '../models/instance';

export class DatabaseConnection {
    private static dataSource: DataSource;

    public static async initialize(): Promise<void> {
        try {
            this.dataSource = new DataSource({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '3306'),
                username: process.env.DB_USERNAME || 'root',
                password: process.env.DB_PASSWORD || '1123',
                database: 'database_instance',
                entities: [Instance],
                synchronize: true,
                logging: true
            });

            await this.dataSource.initialize();
            console.log('Database connection established');
            
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    public static getRepository<T extends ObjectLiteral>(entity: new () => T): Repository<T> {
        if (!this.dataSource) {
            throw new Error('Initialize connection first');
        }
        return this.dataSource.getRepository(entity);
    }

    public static createQueryRunner(): QueryRunner {
        if (!this.dataSource) {
            throw new Error('Initialize connection first');
        }
        return this.dataSource.createQueryRunner();
    }

    public static async shutdown(): Promise<void> {
        if (this.dataSource) {
            await this.dataSource.destroy();
            console.log('Database connection closed');
        }
    }
}
