import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductsAudit1700000000000 } from './migrations/1700000000000-CreateProductsAudit';

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'pg-22a638cc-gasterdreemyr-af30.k.aivencloud.com',
    port: 25185,
    username: 'avnadmin',
    password: 'AVNS_r46zcBn76tWZRgjVozh',
    database: 'defaultdb',
    entities: [Product],
    synchronize: true,
    autoLoadEntities: true,
    migrations: [CreateProductsAudit1700000000000],
    migrationsRun: true,
    ssl: true,
};
