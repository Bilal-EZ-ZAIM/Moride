import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export type CarDocument = HydratedDocument<Car>;

@Schema({ timestamps: true })
export class Car {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  driverId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Le modèle de la voiture ne peut pas être vide' })
  model: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: "L'année de fabrication ne peut pas être vide" })
  year: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Le type de transmission ne peut pas être vide' })
  transmission: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsString()
  @IsNotEmpty({
    message: "Le numéro de la plaque d'immatriculation ne peut pas être vide",
  })
  license: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: "L'assurance doit être valide" })
  insurance: string;

  @Prop({ required: true })
  @IsDateString()
  @IsNotEmpty({
    message: 'La date de la dernière maintenance doit être spécifiée',
  })
  lastMaintenance: string;

  @Prop({
    required: false,
    type: {
      url: { type: String, required: true },
      key: { type: String, required: true },
    },
  })
  @IsOptional()
  @IsNotEmpty({ message: "L'image doit être un objet avec url et key" })
  image?: {
    url: string;
    key: string;
  };
}

export const CarSchema = SchemaFactory.createForClass(Car);
