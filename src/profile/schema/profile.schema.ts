import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

// Define default image constants
const DEFAULT_PROFILE_IMAGE =
  'https://res.cloudinary.com/dsldmzxqt/image/upload/v1737556717/profile_tfo9f4.png';
const DEFAULT_BANNER_IMAGE =
  'https://res.cloudinary.com/dsldmzxqt/image/upload/v1737553353/Black_and_White_Gradient_Corporate_Business_Linkedin_Banner_Background_Photo_xilsqb.png';

// Define interfaces for image types
interface ImageData {
  url: string;
  key: string;
}

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
    type: String,
    required: [true, "Le prenome d'utilisateur est requis"],
  })
  firstname: string;

  @Prop({
    type: String,
    required: [true, "Le nom d'utilisateur est requis"],
  })
  lastname: string;

  @Prop({
    type: {
      url: {
        type: String,
        default: DEFAULT_PROFILE_IMAGE,
      },
      key: {
        type: String,
        default: 'default_profile',
      },
    },
    _id: false,
    default: () => ({
      url: DEFAULT_PROFILE_IMAGE,
      key: 'default_profile',
    }),
  })
  imageProfile: ImageData;

  @Prop({
    type: {
      url: {
        type: String,
        default: DEFAULT_BANNER_IMAGE,
      },
      key: {
        type: String,
        default: 'default_banner',
      },
    },
    _id: false,
    default: () => ({
      url: DEFAULT_BANNER_IMAGE,
      key: 'default_banner',
    }),
  })
  imageBanner: ImageData;

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
        !url ||
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de Facebook invalide.',
    },
    default: '',
    unique: true,
    sparse: true,
  })
  facebook: string;

  @Prop({
    type: String,
    validate: {
      validator: (url: string) =>
        !url ||
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de LinkedIn invalide.',
    },
    default: '',
    unique: true,
    sparse: true,
  })
  linkedIn: string;

  @Prop({
    type: String,
    validate: {
      validator: (url: string) =>
        !url ||
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de WhatsApp invalide.',
    },
    default: '',
    unique: true,
    sparse: true,
  })
  whatsapp: string;

  @Prop({
    type: String,
    validate: {
      validator: (url: string) =>
        !url ||
        /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url),
      message: 'URL de Portfolio invalide.',
    },
    default: '',
    unique: true,
    sparse: true,
  })
  portfolio: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
