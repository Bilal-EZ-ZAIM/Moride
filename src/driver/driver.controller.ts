import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { AuthGuardMoride } from '../guard/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../guard/driver.guard';
import { CreateDriverDto } from './dto/driver.dto';
import { UpdateDriverDto } from './dto/updqteDriver.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('')
  async getAllDrivers(@Request() req: any) {
    return await this.driverService.getAllDrivers();
  }

  @Get('change/to/driver')
  @UseGuards(AuthGuardMoride, RolesGuard)
  async changeRoleToDriver(@Request() req: any) {
    return await this.driverService.changeRoleToDriver(req.user);
  }

  @Get('getDriver')
  @UseGuards(AuthGuardMoride, RolesGuard)
  async getDriver(@Request() req: any) {
    return await this.driverService.getDriverProfile(req.user._id);
  }

  @Get('/getDirver/:id')
  async getDriverById(@Param('id') id: string) {
    return await this.driverService.getDriverById(id);
  }



  @Post('/create')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  async createDriver(@Body() createDriver: CreateDriverDto, @Req() req: any) {
    return await this.driverService.createDriver(createDriver, req.user._id);
  }

  @Put('/update')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  async updateDriver(@Body() updateDriver: UpdateDriverDto, @Req() req: any) {
    return await this.driverService.updateDriver(req.user._id, updateDriver);
  }
}
