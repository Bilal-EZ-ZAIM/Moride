import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PricingDocument = Pricing & Document;

@Schema({ timestamps: true })
export class Pricing {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  hourlyRate: number;

  @Prop({ required: true, type: Number })
  kmRate: number;

  @Prop({ required: true, type: Number })
  minimumFare: number;
}

export const PricingSchema = SchemaFactory.createForClass(Pricing);
