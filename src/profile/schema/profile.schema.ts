import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      url: { type: String, default: 'https://example.com/default-profile.jpg' },
      key: { type: String, default: '' },
    },
  })
  imageProfile: {
    url: string;
    key: string;
  };

  @Prop({
    type: {
      url: { type: String, default: 'https://example.com/default-banner.jpg' },
      key: { type: String, default: '' },
    },
  })
  imageBanner: {
    url: string;
    key: string;
  };

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (address: string) => address.trim() !== '',
      message: "L'adresse est obligatoire et ne peut pas être vide.",
    },
  })
  address: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (phone: string) => /^(\+212|0)[5-7][0-9]{8}$/.test(phone),
      message: 'Numéro de téléphone marocain invalide.',
    },
    unique: true,
  })
  phone: string;

  @Prop({
    type: String,
    default: '',
  })
  profileHighlight: string;

  @Prop({
    type: String,
    validate: {
      validator: (url: string) =>
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de Facebook invalide.',
    },
    default: '',
    unique: true,
  })
  facebook: string;

  @Prop({
    type: String,
    validate: {
      validator: (url: string) =>
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de LinkedIn invalide.',
    },
    default: '',
    unique: true,
  })
  linkedIn: string;

  @Prop({
    type: String,
    validate: {
      validator: (url: string) =>
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de WhatsApp invalide.',
    },
    default: '',
    unique: true,
  })
  whatsapp: string;

  @Prop({
    type: String,
    validate: {
      validator: (url: string) =>
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de Portfolio invalide.',
    },
    default: '',
    unique: true,
  })
  portfolio: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
