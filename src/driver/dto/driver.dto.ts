import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { Gender, DriverStatus } from '../schema/driver.schema'; 

export class CreateDriverDto {
  @IsEnum(Gender, { message: "Le genre doit être 'Homme' ou 'Femme'" })
  @IsNotEmpty({ message: 'Le genre ne peut pas être vide' })
  gender: Gender;

  @Transform(({ value }) => new Date(value)) 
  @IsDate({ message: 'La date de naissance doit être une instance de Date' })
  @IsNotEmpty({ message: 'La date de naissance ne peut pas être vide' })
  birthdate: Date;

  @IsString()
  @IsNotEmpty({ message: 'La nationalité ne peut pas être vide' })
  nationality: string;

  @IsString()
  @IsNotEmpty({ message: "L'adresse ne peut pas être vide" })
  address: string;

  @IsString()
  @IsNotEmpty({
    message: 'Le numéro de permis de conduire ne peut pas être vide',
  })
  licenseNumber: string;

  @Transform(({ value }) => new Date(value)) 
  @IsDate({
    message: "La date d'expiration du permis doit être une instance de Date",
  })
  @IsNotEmpty({
    message: "La date d'expiration du permis ne peut pas être vide",
  })
  licenseExpirationDate: Date;

  @IsNotEmpty({ message: "L'expérience de conduite ne peut pas être vide" })
  drivingExperience: number;

  @IsEnum(DriverStatus, {
    message:
      "Le statut doit être l'un des suivants: Disponible, En Cours, Occupé",
  })
  status: DriverStatus;

  @IsArray() 
  @ArrayNotEmpty({ message: 'La langue préférée ne peut pas être vide' }) 
  @IsString({
    each: true,
    message: 'Chaque langue doit être une chaîne de caractères',
  }) 
  @IsOptional() 
  preferredLanguages: string[];


  @IsString()
  @IsNotEmpty({
    message: 'Le profile ne peut pas être vide',
  })
  profile: string;
}
