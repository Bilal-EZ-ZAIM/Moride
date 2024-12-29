import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      unique: [true, "Le nom d'utilisateur doit être unique"],
      minlength: [3, "Le nom d'utilisateur doit avoir au moins 3 caractères"],
      maxlength: [
        20,
        "Le nom d'utilisateur ne doit pas dépasser 20 caractères",
      ],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: [true, "L'email doit être unique"],
      match: [/\S+@\S+\.\S+/, 'Veuillez entrer un email valide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit avoir au moins 6 caractères'],
    },
    role: {
      type: String,
      enum: ['admin', 'driver', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);
