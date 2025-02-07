import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './Database/dataBase.module';
import { ProfileModule } from './profile/profile.module';
import { DriverModule } from './driver/driver.module';
import { CarModule } from './car/car.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    AuthModule,
    MailModule,
    ProfileModule,
    DriverModule,
    CarModule,
    CloudinaryModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
