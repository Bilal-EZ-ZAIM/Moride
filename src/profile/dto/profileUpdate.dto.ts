import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: "L'adresse doit être une chaîne de caractères." })
  address: string;

  @IsOptional()
  @Matches(/^(\+212|0)[5-7][0-9]{8}$/, {
    message: 'Le numéro de téléphone doit être un numéro valide au Maroc.',
  })
  phone: string;

  @IsOptional()
  @IsString({
    message: 'La phrase qui vous distingue doit être une chaîne de caractères.',
  })
  profileHighlight?: string;

  @IsOptional()
  @IsUrl({}, { message: "L'URL de Facebook n'est pas valide." })
  facebook?: string;

  @IsOptional()
  @IsUrl({}, { message: "L'URL de LinkedIn n'est pas valide." })
  linkedIn?: string;

  @IsOptional()
  @IsUrl({}, { message: "L'URL de WhatsApp n'est pas valide." })
  whatsapp?: string;

  @IsOptional()
  @IsUrl({}, { message: "L'URL du portfolio n'est pas valide." })
  portfolio?: string;
}
