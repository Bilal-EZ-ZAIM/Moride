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
      Monday: { isWorking: false, startTime: null, endTime: null },
      Tuesday: { isWorking: false, startTime: null, endTime: null },
      Wednesday: { isWorking: false, startTime: null, endTime: null },
      Thursday: { isWorking: false, startTime: null, endTime: null },
      Friday: { isWorking: false, startTime: null, endTime: null },
      Saturday: { isWorking: false, startTime: null, endTime: null },
      Sunday: { isWorking: false, startTime: null, endTime: null },
    },
  })
  weekSchedule: {
    Monday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    Tuesday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    Wednesday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    Thursday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    Friday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    Saturday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
    Sunday: {
      isWorking: boolean;
      startTime: string | null;
      endTime: string | null;
    };
  };
}

export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours);
