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
  @UseGuards(AuthGuardMoride)
  @UseGuards(RolesGuard)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workingHoursService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMoride)
  @UseGuards(RolesGuard)
  @Roles('driver')
  update(
    @Param('id') id: string,
    @Body() updateWorkingHoursDto: CreateWorkingHoursDto,
    @Req() req: any,
  ) {
    return this.workingHoursService.update(
      id,
      updateWorkingHoursDto,
      req.user._id,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('driver')
  @UseGuards(AuthGuardMoride)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.workingHoursService.remove(id, req.user._id);
  }
}
