import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight) private flightsRepository: Repository<Flight>
  ) {}

  async create(flightData: any) {
    const flight = this.flightsRepository.create(flightData);
    return await this.flightsRepository.save(flight);
  }

  async search(origin: string, destination: string, date: string) {
    const query = this.flightsRepository.createQueryBuilder('flight')
      .where('flight.origin = :origin', { origin })
      .andWhere('flight.destination = :destination', { destination });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      query.andWhere('flight.departureTime >= :startOfDay', { startOfDay })
           .andWhere('flight.departureTime <= :endOfDay', { endOfDay });
    }

    return await query.getMany();
  }

  async findOne(id: string) {
    const flight = await this.flightsRepository.findOne({ where: { id } });
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
    return flight;
  }
}
