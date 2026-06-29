import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';
import { Multer } from 'multer';

@Injectable()
export class UploadFilesService {
  /**
   * Uploads a file to Cloudinary
   * @param {Multer.File} file
   * @returns {Promise<CloudinaryResponse>}
   */
  public uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result!);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Uploads a profile image to Cloudinary
   * @param {Multer.File} file
   * @returns {Promise<CloudinaryResponse>}
   */
  public uploadProfileImage(file: Express.Multer.File) {
    return this.uploadFile(file);
  }

  /**
   * Uploads a product image to Cloudinary
   * @param {Multer.File} file
   * @returns {Promise<CloudinaryResponse>}
   */
  public uploadProductImage(file: Express.Multer.File) {
    return this.uploadFile(file);
  }
}
