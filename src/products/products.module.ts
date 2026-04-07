import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from 'src/db/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../files/file.service';
import { ProductAudit } from 'src/db/entities/product-audit.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Product, ProductAudit])],
  providers: [ProductsService, FileService],
  controllers: [ProductsController]
})
export class ProductsModule {}
