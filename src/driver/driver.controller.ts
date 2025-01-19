import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/guard/driver.guard';
import { CreateDriverDto } from './dto/driver.dto';
import { UpdateDriverDto } from './dto/updqteDriver.dto';

@Controller('driver')
@UseGuards(AuthGuard, RolesGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('change/to/driver')
  @UseGuards(RolesGuard)
  async changeRoleToDriver(@Request() req: any) {
    return await this.driverService.changeRoleToDriver(req.user);
  }

  @Get('change/to/')
  @UseGuards(RolesGuard)
  @Roles('driver')
  async checkeRole(@Request() req: any) {
    return 'yes';
  }

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles('driver')
  async createDriver(@Body() createDriver: CreateDriverDto, @Req() req: any) {
    return await this.driverService.createDriver(createDriver, req.user._id);
  }

  @Put('/update')
  @UseGuards(RolesGuard)
  @Roles('driver')
  async updateDriver(@Body() updateDriver: UpdateDriverDto, @Req() req: any) {
    return await this.driverService.updateDriver(req.user._id, updateDriver);
  }
}
