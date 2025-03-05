import { PartialType } from '@nestjs/mapped-types';
import { CreatePricingDto } from './create-pricing.dto';

export class UpdateBookingDto extends PartialType(CreatePricingDto) {}
