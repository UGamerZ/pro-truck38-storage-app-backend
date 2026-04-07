import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CONFIG } from "CONFIG";
import { drive_v3, google } from "googleapis";
import { Readable } from "stream";
import { Response } from 'express';

@Injectable()
export class FileService {
  private driveClient: drive_v3.Drive;

  constructor() {
    const oauth2Client = new google.auth.OAuth2(
      CONFIG.GOOGLE_CLIENT_ID,
      CONFIG.GOOGLE_CLIENT_SECRET,
      CONFIG.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: CONFIG.GOOGLE_REFRESH_TOKEN,
    });

    this.driveClient = google.drive({ version: 'v3', auth: oauth2Client }) as any;
  }

  async uploadToGoogleDrive(files: Express.Multer.File[]): Promise<string[]> {
    try {
      if(!files || !files.length) return []

      const uploadPromises = files.map((file) => this.uploadSingleFile(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async uploadSingleFile(file: Express.Multer.File): Promise<string> {
    const fileStream = Readable.from(file.buffer);

    // Загружаем файл на Google Drive
    const uploadedFile = await this.driveClient.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [CONFIG.GOOGLE_DRIVE_FOLDER_ID], // ID папки на Drive
      },
      media: {
        mimeType: file.mimetype,
        body: fileStream,
      },
      fields: 'id',
    });

    const fileId = uploadedFile.data.id;

    // Делаем файл публично доступным
    await this.driveClient.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Возвращаем прямую ссылку на изображение
    return `http://${CONFIG.LOCAL_IP}:3001/files/image/${fileId}`;
  }

  async streamFile(fileId: string, res: Response): Promise<void> {
    try {
      const meta = await this.driveClient.files.get({
        fileId,
        fields: 'mimeType',
      });

      const driveStream = await this.driveClient.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
      );

      res.setHeader('Content-Type', meta.data.mimeType);
      driveStream.data.pipe(res);
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.driveClient.files.delete({ fileId });
    } catch (error) {
      console.error(`Error deleting file: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }
}