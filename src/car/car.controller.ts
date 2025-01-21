import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/car.dto';
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
  async create(@Req() req: any, @Body() createCar: CreateCarDto) {
    console.log(createCar);
  }
}
