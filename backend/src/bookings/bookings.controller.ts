import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Request() req: any, @Body() body: { flightId: string; passengers: number }) {
    // req.user.id is the string UUID mapped from JwtStrategy's relational User
    return this.bookingsService.createBooking(req.user.id.toString(), body.flightId, body.passengers);
  }

  @Get('my-bookings')
  async getMyBookings(@Request() req: any) {
    return this.bookingsService.getUserBookings(req.user.id.toString());
  }
}
