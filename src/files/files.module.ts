import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FilesController } from './files.controller';

@Module({
  providers: [FileService],
  controllers: [FilesController]
})
export class FilesModule {}
