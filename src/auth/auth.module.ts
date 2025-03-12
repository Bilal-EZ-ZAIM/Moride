import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authProviders } from './auth.providers';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService , GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
