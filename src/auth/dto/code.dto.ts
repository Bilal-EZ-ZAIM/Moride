import {
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CodeDto {
  @IsString({ message: 'Le code doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le code est requis.' })
  @Length(6, 6, { message: 'Le code doit contenir exactement 6 caractères.' })
  code: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
  })
  @MaxLength(20, {
    message: 'Le mot de passe ne doit pas dépasser 20 caractères.',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial.',
  })
  newPassword: string;
}
