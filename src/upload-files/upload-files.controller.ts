import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { CreateUploadFileDto } from './dtos/create-upload-file.dto';
import { UpdateUploadFileDto } from './dtos/update-upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../utils/enums';

// ~api/v1/images
@Controller('upload-files')
export class UploadFilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  public uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file);
  }
}
