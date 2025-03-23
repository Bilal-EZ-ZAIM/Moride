import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty({ message: 'Le modèle de la voiture ne peut pas être vide' })
  model: string;

  @IsString()
  @IsNotEmpty({ message: "L'année de fabrication ne peut pas être vide" })
  year: number;

  @IsString()
  @IsNotEmpty({ message: 'Le type de transmission ne peut pas être vide' })
  transmission: string;

  @IsString()
  @IsNotEmpty({
    message: "Le numéro de la plaque d'immatriculation ne peut pas être vide",
  })
  license: string;

  @IsString()
  @IsNotEmpty({ message: "L'assurance doit être valide" })
  insurance: string;

  @IsDateString()
  @IsNotEmpty({
    message: 'La date de la dernière maintenance doit être spécifiée',
  })
  lastMaintenance: string;

  @IsOptional()
  image?: {
    url: string;
    key: string;
  };
}

export class UpdateCarDto {
  @IsString()
  @IsNotEmpty({ message: 'Le modèle de la voiture ne peut pas être vide' })
  model: string;

  @IsString()
  @IsNotEmpty({ message: "L'année de fabrication ne peut pas être vide" })
  year: string;

  @IsString()
  @IsNotEmpty({ message: 'Le type de transmission ne peut pas être vide' })
  transmission: string;

  @IsString()
  @IsNotEmpty({
    message: "Le numéro de la plaque d'immatriculation ne peut pas être vide",
  })
  license: string;

  @IsString()
  @IsNotEmpty({ message: "L'assurance doit être valide" })
  insurance: string;

  @IsDateString()
  @IsNotEmpty({
    message: 'La date de la dernière maintenance doit être spécifiée',
  })
  lastMaintenance: string;

  @IsOptional()
  image?: {
    url: string;
    key: string;
  };
}
