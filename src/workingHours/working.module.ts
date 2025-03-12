import { Module } from '@nestjs/common';
import { WorkingHoursController } from './working.controller';
import { WorkingHoursService } from './working.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkingHours, WorkingHoursSchema } from './schema/working.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkingHours.name, schema: WorkingHoursSchema },
    ]),
    JwtModule,
    AuthModule,
  ],
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService],
  exports: [],
})
export class WorkingHoursModule {}
