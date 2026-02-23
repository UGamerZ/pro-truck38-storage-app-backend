import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './db/entities/product.entity';

@Module({
  imports: [DbModule, TypeOrmModule.forFeature([Product])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
