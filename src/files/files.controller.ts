import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
    constructor(private readonly fileService: FileService) {}

    @Get('image/:fileId')
    async getImage(
        @Param('fileId') fileId: string,
        @Res() res: Response,
    ): Promise<void> {
        await this.fileService.streamFile(fileId, res);
    }
}
