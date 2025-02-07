import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class AcceptOfferDto {
  @IsMongoId({ message: "L'ID du chauffeur est invalide." })
  @IsNotEmpty({ message: "L'ID du chauffeur est requis." })
  driverId: string;

  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @IsNotEmpty({ message: 'Le prix est requis.' })
  price: number;
}
