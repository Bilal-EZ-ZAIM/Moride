import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Pricing, PricingSchema } from './schema/pricing.schema';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pricing.name, schema: PricingSchema }]),
    JwtModule,
    AuthModule,
  ],
  controllers: [PricingController],
  providers: [PricingService],
})
export class PricingModule {}
