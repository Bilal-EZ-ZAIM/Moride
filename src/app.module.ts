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
import { WorkingHoursModule } from './workingHours/working.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { PricingModule } from './Pricing/pricing.module';

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
    WorkingHoursModule,
    ChatModule,
    PricingModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
