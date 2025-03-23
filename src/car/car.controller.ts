import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';
import { AuthGuardMoride } from '../guard/auth.guard';
import { RolesGuard } from '../guard/driver.guard';
import { Roles } from '../roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('car')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly CloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: any,
    @Body() createCarDto: CreateCarDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file buffer available for upload.');
    }

    if (!createCarDto.image) {
      createCarDto.image = {
        url: '',
        key: '',
      };
    }

    const url = await this.CloudinaryService.uploadFile(file);
    createCarDto.image.key = url.public_id;
    createCarDto.image.url = url.url;

    console.log(createCarDto);
    const car = await this.carService.create(createCarDto, req.user._id);
    return {
      message: 'La voiture a été créée avec succès.',
      car,
    };
  }

  @Get('all')
  @UseGuards(AuthGuardMoride)
  async findAll() {
    const cars = await this.carService.findAll();
    return {
      message: 'Les voitures ont été récupérées avec succès.',
      cars,
    };
  }

  @Get('get/car/driver/:driverId')
  async findCarByDriver(@Param('driverId') driverId: string) {
    const car = await this.carService.findCarByDriver(driverId);
    return {
      car,
    };
  }

  @Get('s/:id')
  @UseGuards(AuthGuardMoride)
  async findOne(@Param('id') id: string) {
    const car = await this.carService.findOne(id);
    return {
      message: 'La voiture a été récupérée avec succès.',
      car,
    };
  }

  @Get('/get/mycar')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  async getMyCar(@Req() req: any) {
    const car = await this.carService.getMyCar(req.user._id);
    return {
      car,
    };
  }

  @Put('update/:id')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!file) return cb(null, true);
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const url = await this.CloudinaryService.uploadFile(file);
      updateCarDto.image = {
        key: url.public_id,
        url: url.url,
      };
    }

    const updatedCar = await this.carService.update(
      id,
      updateCarDto,
      req.user._id,
    );
    return {
      message: 'La voiture a été mise à jour avec succès.',
      updatedCar,
    };
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.carService.delete(id, req.user._id);
    return {
      message: 'La voiture a été supprimée avec succès.',
    };
  }
}
