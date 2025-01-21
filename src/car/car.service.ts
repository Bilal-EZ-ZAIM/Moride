import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schema/car.schema';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
  ) {}

  /**
   * Créer une nouvelle voiture.
   */
  async create(createCarDto: CreateCarDto, driverId: string): Promise<Car> {
    const existingDriver = await this.carModel.findOne({ driverId }).exec();
    if (existingDriver) {
      throw new BadRequestException(
        'Vous possédez déjà une voiture dans le système.',
      );
    }

    const existingCar = await this.carModel
      .findOne({ license: createCarDto.license })
      .exec();
    if (existingCar) {
      throw new BadRequestException(
        "Une voiture avec cette plaque d'immatriculation existe déjà.",
      );
    }

    // Créer et sauvegarder la voiture
    const newCar = new this.carModel({ ...createCarDto, driverId });
    return await newCar.save();
  }

  /**
   * Récupérer toutes les voitures.
   */
  async findAll(): Promise<Car[]> {
    return await this.carModel.find().exec();
  }

  /**
   * Récupérer une seule voiture par son ID.
   */
  async findOne(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).exec();
    if (!car) {
      throw new NotFoundException(`Voiture avec l'ID "${id}" introuvable.`);
    }
    return car;
  }

  /**
   * Mettre à jour une voiture par son ID.
   */
  async update(
    id: string,
    updateCarDto: UpdateCarDto,
    driverId: string,
  ): Promise<Car> {
    const existingCar: any = await this.carModel.findById(id).exec();
    if (!existingCar) {
      throw new NotFoundException(`Voiture avec l'ID "${id}" introuvable.`);
    }

    const carIdDriver = existingCar.driverId;

    // Vérifier si l'utilisateur est le propriétaire de la voiture
    if (!carIdDriver.equals(driverId)) {
      throw new BadRequestException(
        "Vous n'êtes pas le propriétaire de cette voiture.",
      );
    }

    // Vérifier si une autre voiture utilise déjà la même plaque
    if (updateCarDto.license) {
      const duplicateCar = await this.carModel
        .findOne({ license: updateCarDto.license, _id: { $ne: id } })
        .exec();
      if (duplicateCar) {
        throw new BadRequestException(
          "Une autre voiture utilise déjà cette plaque d'immatriculation.",
        );
      }
    }

    // Mettre à jour la voiture
    const updatedCar = await this.carModel
      .findByIdAndUpdate(id, updateCarDto, { new: true })
      .exec();
    return updatedCar;
  }

  /**
   * Supprimer une voiture par son ID.
   */
  async delete(id: string, driverId: string): Promise<void> {
    const car: any = await this.carModel.findById(id).exec();
    if (!car) {
      throw new NotFoundException(`Voiture avec l'ID "${id}" introuvable.`);
    }

    const carIdDriver = car.driverId;

    // Vérifier si l'utilisateur est le propriétaire de la voiture
    if (!carIdDriver.equals(driverId)) {
      throw new BadRequestException(
        "Vous n'êtes pas le propriétaire de cette voiture.",
      );
    }

    // Supprimer la voiture
    await this.carModel.findByIdAndDelete(id).exec();
  }
}
