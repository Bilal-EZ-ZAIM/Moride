import { Controller, Get } from '@nestjs/common';

@Controller('working-hours')
export class WorkingHoursController {
  constructor() {}

  @Get('/')
  getHello() {
    return 'hello workingHours';
  }
}
