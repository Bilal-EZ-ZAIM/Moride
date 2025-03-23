import {
  IsBoolean,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class DayScheduleDto {
  @IsBoolean({
    message: 'Le champ "isWorking" doit être un booléen (true ou false).',
  })
  isWorking: boolean;

  @IsOptional()
  @IsString({
    message: 'Le champ "startTime" doit être une chaîne de caractères.',
  })
  startTime?: string | null;

  @IsOptional()
  @IsString({
    message: 'Le champ "endTime" doit être une chaîne de caractères.',
  })
  endTime?: string | null;
}

export class CreateWorkingHoursDto {
  @IsObject({
    message:
      'Le champ "weekSchedule" doit être un objet contenant les jours de la semaine.',
  })
  weekSchedule: {
    monday: DayScheduleDto;
    tuesday: DayScheduleDto;
    wednesday: DayScheduleDto;
    thursday: DayScheduleDto;
    friday: DayScheduleDto;
    saturday: DayScheduleDto;
    sunday: DayScheduleDto;
  };
}
