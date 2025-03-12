import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {

  @Prop({
    required: [true, 'Les participants sont requis'],
    type: [MongooseSchema.Types.ObjectId],
    ref: 'User',
  })
  participants: string[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Message',
    default: null,
  })
  lastMessage: string;

  @Prop({ default: null })
  lastMessageTimestamp: Date;

  @Prop({
    type: Map,
    of: Number,
    default: new Map<string, number>(),
  })
  unreadCount: Map<string, number>;

  @Prop({
    required: [true, 'Le type de chat est requis'],
    enum: ['private', 'group'],
  })
  chatType: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);