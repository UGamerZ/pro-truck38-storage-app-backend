import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './dbconf';

@Module({
    imports: [
        TypeOrmModule.forRoot(dbConfig),
    ],
})
export class DbModule {}
