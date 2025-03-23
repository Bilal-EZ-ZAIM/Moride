import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schema/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    JwtModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AuthModule, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
