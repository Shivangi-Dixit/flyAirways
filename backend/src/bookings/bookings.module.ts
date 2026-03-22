import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { FlightsModule } from '../flights/flights.module';
import { Flight } from '../flights/entities/flight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Flight]),
    FlightsModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
