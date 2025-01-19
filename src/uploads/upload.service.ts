import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadImage(url) {
    return url;
  }
}
