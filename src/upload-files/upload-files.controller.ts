import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { CreateUploadFileDto } from './dtos/create-upload-file.dto';
import { UpdateUploadFileDto } from './dtos/update-upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../utils/enums';
import { createImageUploadPipe } from './pipes/file-upload.pipe';

// ~api/v1/images
@Controller('upload-files')
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @Post('profile-image')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  public uploadImage(
    @UploadedFile(createImageUploadPipe(2 * 1024 * 1024))
    file: Express.Multer.File,
  ) {
    return this.uploadFilesService.uploadProfileImage(file);
  }

  @Post('product-image')
  uploadProductImage(
    @UploadedFile(createImageUploadPipe(5 * 1024 * 1024))
    file: Express.Multer.File,
  ) {
    return this.uploadFilesService.uploadProductImage(file);
  }
}
