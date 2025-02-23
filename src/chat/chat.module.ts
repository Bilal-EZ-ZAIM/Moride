import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schema/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './schema/contact.schema';
import { Message, MessageSchema } from './schema/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    JwtModule, 
    AuthModule, 
  ],
  controllers: [],
  providers: [AuthModule , ChatService],
  exports:[ChatService]
})
export class ChatModule {}
