import { IsNumber, IsNotEmpty, IsPositive, Min, Max } from 'class-validator';

export class CreatePricingDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(1, { message: 'Le tarif horaire doit être supérieur à 0' })
  hourlyRate: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(0.1, { message: 'Le tarif kilométrique doit être supérieur à 0' })
  kmRate: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(1, { message: 'Le tarif minimum doit être supérieur à 0' })
  minimumFare: number;
}
