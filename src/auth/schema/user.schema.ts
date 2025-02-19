import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, "Le nom d'utilisateur est requis"],
    unique: true,
    minlength: [3, "Le nom d'utilisateur doit avoir au moins 3 caractères"],
    maxlength: [20, "Le nom d'utilisateur ne doit pas dépasser 20 caractères"],
  })
  username: string;

  @Prop({
    required: [true, "L'email est requis"],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Veuillez entrer un email valide'],
  })
  email: string;

  @Prop({
    minlength: [6, 'Le mot de passe doit avoir au moins 6 caractères'],
  })
  password: string;

  @Prop({
    type: String,
    enum: ['admin', 'driver', 'user'],
    default: 'user',
  })
  role: string;

  @Prop({
    type: Boolean,
    default: false, 
  })
  isOnline: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
