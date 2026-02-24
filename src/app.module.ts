import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [DbModule, ProductsModule],
})
export class AppModule {}
