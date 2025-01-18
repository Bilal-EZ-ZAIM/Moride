import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EmailDto {
  @IsString({ message: "L'email doit être une chaîne de caractères." })
  @IsNotEmpty({ message: "L'email est requis." })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @MinLength(10, { message: "L'email doit contenir au moins 10 caractères." })
  @MaxLength(100, { message: "L'email ne doit pas dépasser 100 caractères." })
  email: string;
}
