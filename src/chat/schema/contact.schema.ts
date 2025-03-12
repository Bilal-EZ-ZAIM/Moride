import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: true })
export class Contact {
  @Prop({
    required: [true, "L'ID du propriétaire est requis"],
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  ownerId: string;

  @Prop({
    required: [true, "L'ID du contact est requis"],
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  contactId: string;

  @Prop({ default: '' })
  alias: string;

  @Prop({
    required: [true, 'Le statut du contact est requis'],
    enum: ['accepted', 'blocked', 'pending'],
  })
  status: string;

  @Prop({ default: null })
  lastInteractionTimestamp: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);