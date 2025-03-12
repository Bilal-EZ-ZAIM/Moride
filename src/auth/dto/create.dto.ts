import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  Validate,
} from 'class-validator';
import { MatchPasswordsValidator } from '../../validation/match-passwords.validator';

export class CreateDto {
  @IsString({
    message: "Le nom d'utilisateur doit être une chaîne de caractères.",
  })
  @IsNotEmpty({ message: "Le nom d'utilisateur est requis." })
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
  })
  @MaxLength(20, {
    message: "Le nom d'utilisateur ne doit pas dépasser 20 caractères.",
  })
  username: string;

  @IsString({ message: "L'email doit être une chaîne de caractères." })
  @IsNotEmpty({ message: "L'email est requis." })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @MinLength(10, { message: "L'email doit contenir au moins 10 caractères." })
  @MaxLength(100, { message: "L'email ne doit pas dépasser 100 caractères." })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  password: string;

  @IsString({
    message:
      'La confirmation du mot de passe doit être une chaîne de caractères.',
  })
  @IsNotEmpty({ message: 'La confirmation du mot de passe est requise.' })
  @MinLength(6, {
    message:
      'La confirmation du mot de passe doit contenir au moins 6 caractères.',
  })
  @Validate(MatchPasswordsValidator, {
    message: 'Les mots de passe ne correspondent pas.',
  })
  confirmPassword: string;
}
