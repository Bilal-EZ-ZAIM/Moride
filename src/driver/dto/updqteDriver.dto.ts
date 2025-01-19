import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { Gender, DriverStatus } from '../schema/driver.schema';

export class UpdateDriverDto {
  @IsEnum(Gender, { message: "Le genre doit être 'Homme' ou 'Femme'" })
  @IsOptional()
  gender?: Gender;

  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'La date de naissance doit être une instance de Date' })
  @IsOptional()
  birthdate?: Date;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @Transform(({ value }) => new Date(value)) 
  @IsDate({
    message: "La date d'expiration du permis doit être une instance de Date",
  })
  @IsOptional()
  licenseExpirationDate?: Date;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: "L'expérience de conduite doit être un nombre positif" })
  drivingExperience?: number;

  @IsEnum(DriverStatus, {
    message:
      "Le statut doit être l'un des suivants: Disponible, En Cours, Occupé",
  })
  @IsOptional()
  status?: DriverStatus;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'La note doit être un nombre positif' })
  @Max(5, { message: 'La note ne peut pas dépasser 5' })
  rating?: number;

  @IsString({ each: true })
  @IsOptional()
  preferredLanguages?: string[];
}
