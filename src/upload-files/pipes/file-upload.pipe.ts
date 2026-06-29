import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const createImageUploadPipe = (maxSize: number) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize,
        message: `File too large, max size is ${maxSize / (1024 * 1024)}MB`,
      }),
      new FileTypeValidator({
        fileType: /image\/(jpeg|jpg|png|webp)/,
      }),
    ],
  });

export const createImagesUploadPipe = (maxSize: number) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize,
        message: `File too large, max size is ${maxSize / (1024 * 1024)}MB`,
      }),
      new FileTypeValidator({
        fileType: /image\/(jpeg|jpg|png|webp)/,
      }),
    ],
    fileIsRequired: true,
  });
