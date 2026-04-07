import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CreateProductsAudit1700000000000 } from './migrations/1700000000000-CreateProductsAudit';

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'proTruck38Storage',
    entities: [Product],
    synchronize: true,
    autoLoadEntities: true,
    migrations: [CreateProductsAudit1700000000000],
    migrationsRun: true,
};
