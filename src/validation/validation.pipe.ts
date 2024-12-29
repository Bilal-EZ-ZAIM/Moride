import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(typeof value);

    if (typeof +value !== 'number')
      throw new HttpException('Id is not a number ', 404);
    return +value;
  }
}
