import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FlightService, Flight } from './core/services/flight.service';

import { FlightSearchComponent, SearchCriteria } from './components/flight-search/flight-search.component';
import { FlightCardComponent } from './components/flight-card/flight-card.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';

declare var particlesJS: any;
declare var Stats: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FlightSearchComponent, FlightCardComponent, BookingModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private flightService = inject(FlightService);

  // Orchestrator State
  origin = signal('AUH');
  destination = signal('LHR');
  date = signal('2026-04-10');
  
  flights = signal<Flight[]>([]);
  isSearching = signal(false);
  hasSearched = signal(false);
  selectedFlight = signal<Flight | null>(null);

  ngAfterViewInit() {
    // Config provided by user
    particlesJS("particles-js", {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } },
        "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
        "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
        "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
      },
      "retina_detect": true
    });

    // Stats config provided by user
    const stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    // Append to body as per user snippet
    document.body.appendChild(stats.domElement);

    const count_particles = document.querySelector('.js-count-particles') as HTMLElement;
    const update = () => {
      stats.begin();
      stats.end();
      if ((window as any).pJSDom?.[0]?.pJS?.particles?.array) {
        if (count_particles) {
          count_particles.innerText = (window as any).pJSDom[0].pJS.particles.array.length;
        }
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  handleSearch(criteria: SearchCriteria) {
    this.isSearching.set(true);
    this.hasSearched.set(true);
    this.origin.set(criteria.origin);
    this.destination.set(criteria.destination);
    this.date.set(criteria.date);
    
    setTimeout(() => {
      this.flightService.searchFlights(criteria.origin, criteria.destination, criteria.date)
        .subscribe({
          next: (data) => {
            if (data && data.length > 0) {
              this.flights.set(data);
            } else {
              this.useFallbackData();
            }
            this.isSearching.set(false);
          },
          error: (err) => {
            console.error('Error fetching flights', err);
            this.useFallbackData();
            this.isSearching.set(false);
          }
        });
    }, 800);
  }

  private useFallbackData() {
    this.flights.set([
      { id: '1', flightNumber: 'NX-99', origin: this.origin(), destination: this.destination(), departureTime: `${this.date()}T02:00:00Z`, arrivalTime: `${this.date()}T06:30:00Z`, price: 450, availableSeats: 12 },
      { id: '2', flightNumber: 'NX-21', origin: this.origin(), destination: this.destination(), departureTime: `${this.date()}T14:15:00Z`, arrivalTime: `${this.date()}T18:45:00Z`, price: 580, availableSeats: 4 }
    ]);
  }

  openBooking(flight: Flight) {
    this.selectedFlight.set(flight);
  }

  closeBookingModal() {
    this.selectedFlight.set(null);
  }
}
