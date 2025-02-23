import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    required: [true, "L'ID du chat est requis"],
    type: MongooseSchema.Types.ObjectId,
    ref: 'Chat',
  })
  chatId: string;

  @Prop({
    required: [true, "L'ID de l'expéditeur est requis"],
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  sender: string;

  @Prop({ required: [true, 'Le contenu du message est requis'] })
  content: string;

  @Prop({
    required: [true, 'Le type de message est requis'],
    enum: ['text', 'image', 'video', 'audio', 'link', 'file', 'location'],
  })
  messageType: string;

  @Prop({
    required: [true, 'Le statut du message est requis'],
    enum: ['sent', 'delivered', 'read', 'deleted'],
  })
  status: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  readBy: string[];

  @Prop({
    type: Map,
    of: String,
    default: new Map<string, string>(),
  })
  reactions: Map<string, string>;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Message',
    default: null,
  })
  forwardedFrom: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
