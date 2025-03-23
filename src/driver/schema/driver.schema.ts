import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsEnum,
  Max,
  Min,
} from 'class-validator';

export enum Gender {
  MALE = 'Homme',
  FEMALE = 'Femme',
}

export enum DriverStatus {
  AVAILABLE = 'Disponible',
  IN_PROGRESS = 'En Cours',
  BUSY = 'Occupé',
}

export type DriverDocument = HydratedDocument<Driver>;

@Schema({ timestamps: true })
export class Driver {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  @IsEnum(Gender, { message: "Le genre doit être 'Homme' ou 'Femme'" })
  @IsNotEmpty({ message: 'Le genre ne peut pas être vide' })
  gender: Gender;

  @Prop({ required: true })
  @IsDate()
  @IsNotEmpty({ message: 'La date de naissance ne peut pas être vide' })
  birthdate: Date;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'La nationalité ne peut pas être vide' })
  nationality: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: "L'adresse ne peut pas être vide" })
  address: string;

  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty({
    message: 'Le numéro de permis de conduire ne peut pas être vide',
  })
  licenseNumber: string;

  @Prop({ required: true })
  @IsDate()
  @IsNotEmpty({
    message: "La date d'expiration du permis ne peut pas être vide",
  })
  licenseExpirationDate: Date;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty({ message: "L'expérience de conduite ne peut pas être vide" })
  drivingExperience: number;

  @Prop({ default: DriverStatus.AVAILABLE })
  @IsEnum(DriverStatus, {
    message:
      "Le statut doit être l'un des suivants: Disponible, En Cours, Occupé",
  })
  status: DriverStatus;

  @Prop({ default: 0 })
  @IsNumber()
  @Min(0, { message: 'La note doit être un nombre positif' })
  @Max(5, { message: 'La note ne peut pas dépasser 5' })
  rating: number;

  @Prop({ type: [String], required: true })
  @IsNotEmpty({ message: 'La langue préférée ne peut pas être vide' })
  preferredLanguages: string[];

  @Prop({
    type: [
      {
        comment: { type: String, required: true },
        userId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
  comments: { comment: string; userId: string; createdAt: Date }[];

  @Prop({
    type: [
      {
        rating: { type: Number, required: true },
        userId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
  ratings: { rating: number; userId: string; createdAt: Date }[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' })
  profile: MongooseSchema.Types.ObjectId;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
