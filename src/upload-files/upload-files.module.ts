import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [UploadFilesController],
  providers: [UploadFilesService, CloudinaryProvider],
  exports: [UploadFilesService, CloudinaryProvider],
})
export class UploadFilesModule {}
