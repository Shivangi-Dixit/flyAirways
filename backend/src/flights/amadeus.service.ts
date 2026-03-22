import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// @ts-ignore
import Amadeus from 'amadeus';

@Injectable()
export class AmadeusService {
  private amadeus: any;
  private readonly logger = new Logger(AmadeusService.name);

  constructor(private configService: ConfigService) {
    this.amadeus = new Amadeus({
      clientId: this.configService.get('AMADEUS_CLIENT_ID'),
      clientSecret: this.configService.get('AMADEUS_CLIENT_SECRET'),
    });
  }

  /**
   * Searches the Amadeus API for flight offers matching criteria.
   */
  async searchFlights(origin: string, destination: string, date: string): Promise<any[]> {
    try {
      const response = await this.amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: '1',
        max: 20,
      });

      return response.data.map((offer: any) => this.mapOfferToFlight(offer, origin, destination));
    } catch (error: any) {
      this.logger.error('Failed to fetch from Amadeus API', error?.response?.result || error);
      return [];
    }
  }

  /**
   * Searches the Amadeus API for airport and city locations based on a keyword.
   */
  async searchAirports(keyword: string): Promise<any[]> {
    try {
      if (!keyword) return [];
      const response = await this.amadeus.referenceData.locations.get({
        keyword,
        subType: 'AIRPORT,CITY',
        page: { limit: 10 }
      });
      
      return response.data.map((location: any) => ({
        iataCode: location.iataCode,
        name: location.name,
        cityName: location.address?.cityName,
        countryName: location.address?.countryName
      }));
    } catch (error: any) {
      this.logger.error('Failed to fetch locations from Amadeus', error?.response?.result || error);
      return [];
    }
  }

  /**
   * Helper function to map the Amadeus API payload into the standard Flight schema 
   * format that the frontend components expect.
   */
  private mapOfferToFlight(offer: any, origin: string, destination: string) {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    return {
      _id: offer.id,
      flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
      origin,
      destination,
      departureTime: firstSegment.departure.at,
      arrivalTime: lastSegment.arrival.at,
      price: parseFloat(offer.price.total),
      availableSeats: offer.numberOfBookableSeats || 9,
    };
  }
}
