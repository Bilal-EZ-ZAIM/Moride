import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';
import { diskStorage, memoryStorage } from 'multer'; // Import memoryStorage for Multer

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      if (!file || !file.buffer) {
        return reject(new Error('No file buffer available for upload.'));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profile_images' }, // Optional: specify a folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result);
        },
      );

      // Create a stream and pipe the file buffer
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }
}
