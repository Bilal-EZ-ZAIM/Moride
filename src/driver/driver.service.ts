import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/driver.dto';
import mongoose, { Model } from 'mongoose';
import { Driver } from './schema/driver.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateDriverDto } from './dto/updqteDriver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
  ) {}

  async getAllDrivers() {
    return await this.driverModel
      .find()
      .populate('profile', 'imageProfile lastname firstname imageBanner');
  }

  async changeRoleToDriver(user: any) {
    user.role = 'driver';

    await user.save();

    return {
      message: 'Role changé en conducteur avec succès',
      user,
    };
  }

  async createDriver(createDriver: CreateDriverDto, userId: string) {
    const checkDriverByUser = await this.driverModel.findOne({ userId });
    if (checkDriverByUser) {
      throw new BadRequestException(
        `Un conducteur avec cet utilisateur existe déjà. Veuillez vérifier l'utilisateur ou mettre à jour ses informations.`,
      );
    }

    const checkDriverByLicense = await this.driverModel.findOne({
      licenseNumber: createDriver.licenseNumber,
    });
    if (checkDriverByLicense) {
      throw new BadRequestException(
        `Un conducteur avec ce numéro de permis existe déjà. Veuillez vérifier le numéro de permis ou en utiliser un autre.`,
      );
    }

    const createdDriver = new this.driverModel({
      ...createDriver,
      userId,
    });

    await createdDriver.save();

    return {
      message: 'Le conducteur a été créé avec succès.',
      driver: createdDriver,
    };
  }

  async updateDriver(driverId: string, updateDriverDto: UpdateDriverDto) {
    const existingDriver = await this.driverModel.findOne({ userId: driverId });
    if (!existingDriver) {
      throw new BadRequestException(
        `Aucun conducteur trouvé avec cet ID. Veuillez vérifier l'ID du conducteur.`,
      );
    }

    const checkDriverByLicense = await this.driverModel.findOne({
      licenseNumber: updateDriverDto.licenseNumber,
    });
    if (
      checkDriverByLicense &&
      checkDriverByLicense._id !== existingDriver._id
    ) {
      throw new BadRequestException(
        `Un conducteur avec ce numéro de permis existe déjà. Veuillez vérifier le numéro de permis ou en utiliser un autre.`,
      );
    }

    const updatedDriver = await this.driverModel.findByIdAndUpdate(
      existingDriver._id,
      updateDriverDto,
      { new: true },
    );

    return {
      message: 'Le conducteur a été mis à jour avec succès.',
      driver: updatedDriver,
    };
  }

  async getDriver(id: string) {
    // Convert string to ObjectId
    const objectId = new mongoose.Types.ObjectId(id).toString();
    console.log(objectId);

    const driver = await this.driverModel.findOne({ userId: objectId });
    console.log(driver);

    if (!driver) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message:
            "Le chauffeur avec cet identifiant n'existe pas dans notre système. Veuillez vérifier l'identifiant et réessayer.",
          error: 'Chauffeur non trouvé',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return driver._id;
  }

  async getDriverProfile(id: string) {
    // Convert string to ObjectId
    const objectId = new mongoose.Types.ObjectId(id).toString();
    console.log(objectId);

    const driver = (
      await this.driverModel.findOne({ userId: objectId })
    ).populate('profile');
    console.log(driver);

    if (!driver) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message:
            "Le chauffeur avec cet identifiant n'existe pas dans notre système. Veuillez vérifier l'identifiant et réessayer.",
          error: 'Chauffeur non trouvé',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return driver;
  }

  async getDriverById(id: string) {
    // Convert string to ObjectId
    const objectId = new mongoose.Types.ObjectId(id).toString();
    console.log(objectId);

    const driver = (await this.driverModel.findById(id)).populate('profile');
    console.log(driver);

    if (!driver) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message:
            "Le chauffeur avec cet identifiant n'existe pas dans notre système. Veuillez vérifier l'identifiant et réessayer.",
          error: 'Chauffeur non trouvé',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return driver;
  }
}
