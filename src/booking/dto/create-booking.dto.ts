import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  Min,
  Max,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty({ message: 'Le lieu de départ est requis.' })
  from: string;

  @IsString()
  @IsNotEmpty({ message: 'La destination est requise.' })
  to: string;

  @IsDateString(
    { strict: true },
    { message: 'La date du trajet doit être une date valide.' },
  )
  @IsNotEmpty({ message: 'La date du trajet est requise.' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: "L'heure du trajet est requise." })
  time: string;

  @IsNumber()
  @Min(1, { message: 'Il doit y avoir au moins un passager.' })
  @Max(4, { message: 'Le nombre maximum de passagers est de 4.' })
  passengers: number;

  @IsEnum(['private', 'shared', 'premium'], {
    message: "Le type de trajet doit être 'private', 'shared' ou 'premium'.",
  })
  tripType: 'private' | 'shared' | 'premium';

  @IsOptional()
  @IsString()
  notes?: string;

  // Champs prix requis
  @IsNumber()
  @IsPositive({ message: 'Le prix de départ doit être un nombre positif.' })
  @IsNotEmpty({ message: 'Le prix de départ est requis.' })
  priceFrom: number;

  @IsNumber()
  @IsPositive({
    message: 'Le prix de destination doit être un nombre positif.',
  })
  @IsNotEmpty({ message: 'Le prix de destination est requis.' })
  priceTo: number;
}
