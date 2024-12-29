import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ConfiremPasssword implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(metadata);

    console.log(value);
  }
}
