import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  create(@Body() createFlightDto: any) {
    return this.flightsService.create(createFlightDto);
  }

  @Get('search')
  search(@Query('origin') origin: string, @Query('destination') destination: string, @Query('date') date: string) {
    return this.flightsService.search(origin, destination, date);
  }

  @Get('locations')
  getLocations(@Query('keyword') keyword?: string) {
    const all = [
      { iataCode: 'AUH', cityName: 'Abu Dhabi' },
      { iataCode: 'DXB', cityName: 'Dubai' },
      { iataCode: 'LHR', cityName: 'London Heathrow' },
      { iataCode: 'JFK', cityName: 'New York' },
      { iataCode: 'LAX', cityName: 'Los Angeles' },
      { iataCode: 'SYD', cityName: 'Sydney' },
      { iataCode: 'SIN', cityName: 'Singapore' },
      { iataCode: 'CDG', cityName: 'Paris' },
      { iataCode: 'HND', cityName: 'Tokyo Haneda' },
      { iataCode: 'FRA', cityName: 'Frankfurt' }
    ];
    if (keyword && keyword.length >= 3) {
      const lower = keyword.toLowerCase();
      return all.filter(a => a.iataCode.toLowerCase().includes(lower) || a.cityName.toLowerCase().includes(lower));
    }
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightsService.findOne(id);
  }
}
