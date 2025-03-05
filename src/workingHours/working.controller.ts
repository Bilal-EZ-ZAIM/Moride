import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkingHoursService } from './working.service';
import { CreateWorkingHoursDto } from './dto/create.working.dto';
import { AuthGuardMoride } from '../guard/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../guard/driver.guard';

@Controller('working-hours')
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  @Post()
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  create(
    @Body() createWorkingHoursDto: CreateWorkingHoursDto,
    @Req() req: any,
  ) {
    return this.workingHoursService.create(createWorkingHoursDto, req.user._id);
  }

  @Get()
  findAll() {
    return this.workingHoursService.findAll();
  }

  @Get('getone/:id')
  findOne(@Param('id') id: string) {
    return this.workingHoursService.findOne(id);
  }

  @Get('/driver')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  findOneByDriver(@Req() req: any) {
    console.log('+++++++++++++++++++');
    return this.workingHoursService.findOneByDriver(req.user._id);
  }

  @Get('/driver/work-schedule/:id')
  getDriverWorkSchedule(@Param('id') id: string) {
    return this.workingHoursService.getDriverWorkSchedule(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  update(
    @Param('id') id: string,
    @Body() updateWorkingHoursDto: any,
    @Req() req: any,
  ) {
    console.log('wryxtcuvhbjnk,');
    return this.workingHoursService.update(
      id,
      updateWorkingHoursDto,
      req.user._id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.workingHoursService.remove(id, req.user._id);
  }
}
