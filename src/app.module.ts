import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [DbModule, ProductsModule, FilesModule],
})
export class AppModule {}
