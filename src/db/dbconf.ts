import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

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
};