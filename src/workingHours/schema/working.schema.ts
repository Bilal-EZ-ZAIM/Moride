import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type WorkingDocument = HydratedDocument<WorkingHours>;

@Schema({ timestamps: true })
export class WorkingHours extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'Le champ "driverId" est requis.'],
  })
  driverId: Types.ObjectId;

  @Prop({
    type: Object,
    default: {
      monday: { isWorking: false, startTime: null, endTime: null },
      tuesday: { isWorking: false, startTime: null, endTime: null },
      wednesday: { isWorking: false, startTime: null, endTime: null },
      thursday: { isWorking: false, startTime: null, endTime: null },
      friday: { isWorking: false, startTime: null, endTime: null },
      saturday: { isWorking: false, startTime: null, endTime: null },
      sunday: { isWorking: false, startTime: null, endTime: null },
    },
  })
  weekSchedule: {
    monday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    tuesday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    wednesday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    thursday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    friday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    saturday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    sunday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
  };
}

export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours);
