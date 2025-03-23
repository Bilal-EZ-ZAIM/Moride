import { IsString, IsBoolean, IsArray, IsIn, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty({ message: "Le nom de la room est requis" })
  @MinLength(3, { message: "Le nom de la room doit avoir au moins 3 caractères" })
  @MaxLength(20, { message: "Le nom de la room ne doit pas dépasser 20 caractères" })
  roomName?: string;

  @IsString()
  @IsNotEmpty({ message: "L'expéditeur est requis" })
  sender?: string;

  @IsString()
  @IsNotEmpty({ message: "Le destinataire est requis" })
  receiver?: string;

  @IsString()
  @IsNotEmpty({ message: "Le type de message est requis" })
  @IsIn(['msg', 'image', 'audio', 'link'], { message: "Type de message invalide" })
  type: string;

  @IsString()
  @IsNotEmpty({ message: "Le contenu du message est requis" })
  content: string;

}
