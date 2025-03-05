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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuardMoride } from '../guard/auth.guard';
import { RolesGuard } from '../guard/driver.guard';
import { Roles } from '../roles/roles.decorator';
import { CreateApplicationDto } from './dto/createa-pplication.dto';
import { AcceptOfferDto } from './dto/accept-offer.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Post('')
  @UseGuards(AuthGuardMoride)
  create(@Body() createBookingDto: any, @Req() req: any) {
    console.log(createBookingDto);
    return this.bookingService.create(
      createBookingDto,
      req.user._id,
      req.user.profileId,
    );
  }

  @Get('my-booking')
  @UseGuards(AuthGuardMoride)
  findMyBooking(@Req() req: any) {
    return this.bookingService.findMyBooking(req.user._id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardMoride)
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: any,
  ) {
    return this.bookingService.update(id, updateBookingDto, req.user._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuardMoride)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.bookingService.remove(id, req.user._id);
  }

  @Patch(':id/apply')
  @UseGuards(AuthGuardMoride, RolesGuard)
  @Roles('driver')
  applyForBooking(
    @Param('id') id: string,
    @Req() req: any,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    console.log(id);
    return this.bookingService.applyForBooking(
      id,
      req.user._id,
      createApplicationDto,
    );
  }

  @Patch(':id/accepter')
  @UseGuards(AuthGuardMoride)
  async acceptOffer(
    @Req() req: any,
    @Body() data: AcceptOfferDto,
    @Param('id') id: string,
  ) {
    return await this.bookingService.acceptOffer(id, data, req.user._id);
  }
}
