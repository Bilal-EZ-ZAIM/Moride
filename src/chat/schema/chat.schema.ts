import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    required: [true, 'Le nom de la room est requis'],
    unique: true
  })
  roomName: string;

  @Prop({
    required: [true, "L'expéditeur est requis"],
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  sender: string;

  @Prop({
    required: [true, 'Le destinataire est requis'],
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  receiver: string;

  @Prop({
    required: [true, 'Le type de message est requis'],
    enum: ['msg', 'image', 'audio', 'link'],
  })
  type: string;

  @Prop({
    required: [true, 'Le contenu du message est requis'],
  })
  content: string;

  @Prop({ default: false })
  isSeen: boolean;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  readBy: string[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
