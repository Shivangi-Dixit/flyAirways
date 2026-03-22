import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost:3000/flights';

  constructor(private http: HttpClient) {}

  searchAirports(keyword: string): Observable<Airport[]> {
    let params = new HttpParams().set('keyword', keyword);
    return this.http.get<Airport[]>(`${this.apiUrl}/locations`, { params });
  }

  searchFlights(origin: string, destination: string, date: string): Observable<Flight[]> {
    let params = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('date', date);
    
    return this.http.get<Flight[]>(`${this.apiUrl}/search`, { params });
  }

  getFlight(id: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${id}`);
  }
}
