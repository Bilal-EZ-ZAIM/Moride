import { Injectable } from '@nestjs/common';
import { Car } from './schema/car.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<Car>,
  ) {}
}
