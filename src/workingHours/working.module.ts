import { Module } from '@nestjs/common';
import { WorkingHoursController } from './working.controller';

@Module({
  imports: [],
  controllers: [WorkingHoursController],
  providers: [],
  exports: [],
})
export class WorkingHoursModule {}
