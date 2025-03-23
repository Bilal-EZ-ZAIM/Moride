import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ConfiremPasssword implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
  }
}
