import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Flight } from '../flights/entities/flight.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingsRepository: Repository<Booking>,
    @InjectRepository(Flight) private flightsRepository: Repository<Flight>,
    private dataSource: DataSource,
  ) {}

  async createBooking(userId: string, flightId: string, passengers: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Pessimistic write lock to prevent race conditions on seats
      const flight = await queryRunner.manager.findOne(Flight, {
        where: { id: flightId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!flight) {
        throw new NotFoundException('Flight not found');
      }

      if (flight.availableSeats < passengers) {
        throw new BadRequestException('Not enough seats available');
      }

      flight.availableSeats -= passengers;
      await queryRunner.manager.save(flight);

      const totalPrice = flight.price * passengers * 1.1; // adding fees
      const pnr = this.generatePNR();

      const booking = this.bookingsRepository.create({
        userId,
        flightId,
        passengers,
        totalPrice,
        pnr,
        status: 'CONFIRMED'
      });

      const savedBooking = await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();

      return savedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserBookings(userId: string) {
    return await this.bookingsRepository.find({
      where: { userId },
      relations: ['flight'],
      order: { createdAt: 'DESC' }
    });
  }

  private generatePNR(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
