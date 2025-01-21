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
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto, UpdateCarDto } from './dto/car.dto';
import { AuthGuardMoride } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/driver.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('car')
@UseGuards(AuthGuardMoride)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('driver')
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() createCarDto: CreateCarDto) {
    const car = await this.carService.create(createCarDto, req.user._id);
    return {
      message: 'La voiture a été créée avec succès.',
      car,
    };
  }

  @Get('all')
  async findAll() {
    const cars = await this.carService.findAll();
    return {
      message: 'Les voitures ont été récupérées avec succès.',
      cars,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const car = await this.carService.findOne(id);
    return {
      message: 'La voiture a été récupérée avec succès.',
      car,
    };
  }

  @Put('update/:id')
  @UseGuards(RolesGuard)
  @Roles('driver')
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Req() req: any,
  ) {
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
  @UseGuards(RolesGuard)
  @Roles('driver')
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.carService.delete(id, req.user._id);
    return {
      message: 'La voiture a été supprimée avec succès.',
    };
  }
}
