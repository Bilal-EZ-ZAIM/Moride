import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true, min: 1, max: 4 })
  passengers: number;

  @Prop({ enum: ['private', 'shared', 'premium'], default: 'private' })
  tripType: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({
    type: [
      {
        driverId: { type: Types.ObjectId, ref: 'Driver', required: true },
        message: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    default: [],
  })
  applicants: {
    driverId: Types.ObjectId;
    message: string;
    date: string;
    time: string;
    price: number;
  }[];

  @Prop({
    type: {
      driverId: { type: Types.ObjectId, ref: 'Driver', required: true },
      confirmation: { type: Boolean, default: false },
    },
    required: false,
  })
  selectedDriver: {
    driverId: Types.ObjectId;
    confirmation: boolean;
  };

  @Prop({ required: false, type: Number })
  finalPrice: number;

  @Prop({ required: false, type: Number, min: 1, max: 5 })
  rating?: number;

  @Prop({ type: String })
  driverComment?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
