import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { Request } from 'express';
import { PricingService } from './pricing.service';
import { AuthGuardMoride } from 'src/guard/auth.guard';

@Controller('pricing')
export class PricingController {
  constructor(private readonly PricingService: PricingService) {}

  @Post()
  @UseGuards(AuthGuardMoride)
  async createPricing(
    @Body() createPricingDto: CreatePricingDto,
    @Req() req: Request,
  ) {
    const userId = req.user['_id'];
    return this.PricingService.createPricing(createPricingDto, userId);
  }

  @Get()
  @UseGuards(AuthGuardMoride)
  async getMyPricing(@Req() req: Request) {
    const userId = req.user['_id'];
    return this.PricingService.getPricingById(userId);
  }

  @Get(':id')
  async getPricing(@Param('id') id: string) {
    return this.PricingService.getPricingById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMoride)
  async updatePricing(
    @Param('id') id: string,
    @Body() updatePricingDto: any,
    @Req() req: Request,
  ) {
    const userId = req.user['_id'];
    console.log('yess');
    return this.PricingService.updatePricing(id, updatePricingDto, userId);
  }

  @Delete(':id')
  async deletePricing(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user['_id'];
    return this.PricingService.deletePricing(id, userId);
  }
}
