import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { authProviders } from './auth.providers';
import { DatabaseModule } from 'src/Database/dataBase.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: 'bilalnaxZAim',
      signOptions: { expiresIn: '90d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...authProviders],
  exports: [],
})
export class AuthModule {}
