import { Component, EventEmitter, Output, Input, signal, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { FlightService } from '../../core/services/flight.service';
import flatpickr from 'flatpickr';

export interface SearchCriteria {
  origin: string;
  destination: string;
  date: string;
}

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements AfterViewInit {
  private flightService = inject(FlightService);

  @Output() onSearch = new EventEmitter<SearchCriteria>();
  @Input() isSearching = false;

  @ViewChild('datePicker') datePicker!: ElementRef;

  origin = signal('');
  destination = signal('');
  date = signal('2026-04-10');

  filteredOrigins = signal<any[]>([]);
  filteredDestinations = signal<any[]>([]);
  showOriginDropdown = signal(false);
  showDestDropdown = signal(false);

  private originSubject = new Subject<string>();
  private destSubject = new Subject<string>();

  constructor() {
    this.originSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(val => val.length >= 3 ? this.flightService.searchAirports(val) : of([]))
    ).subscribe({
      next: (data) => {
        this.filteredOrigins.set(data);
        this.showOriginDropdown.set(data.length > 0);
      },
      error: () => this.filteredOrigins.set([])
    });

    this.destSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(val => val.length >= 3 ? this.flightService.searchAirports(val) : of([]))
    ).subscribe({
      next: (data) => {
        this.filteredDestinations.set(data);
        this.showDestDropdown.set(data.length > 0);
      },
      error: () => this.filteredDestinations.set([])
    });
  }

  ngAfterViewInit() {
    flatpickr(this.datePicker.nativeElement, {
      dateFormat: "Y-m-d",
      minDate: "today",
      defaultDate: "2026-04-10",
      onChange: (selectedDates, dateStr) => {
        this.date.set(dateStr);
      }
    });
  }

  filterOrigins(event: any) {


    const val = event.target.value.toUpperCase();
    this.origin.set(val);
    if (val.length < 3) {
      this.showOriginDropdown.set(false);
      this.filteredOrigins.set([]);
    } else {
      this.originSubject.next(val);
    }
  }

  filterDestinations(event: any) {
    const val = event.target.value.toUpperCase();
    this.destination.set(val);
    if (val.length < 3) {
      this.showDestDropdown.set(false);
      this.filteredDestinations.set([]);
    } else {
      this.destSubject.next(val);
    }
  }

  selectOrigin(code: string) {
    this.origin.set(code);
    this.showOriginDropdown.set(false);
  }

  selectDest(code: string) {
    this.destination.set(code);
    this.showDestDropdown.set(false);
  }

  submitSearch() {
    this.onSearch.emit({ origin: this.origin(), destination: this.destination(), date: this.date() });
  }

  closeDropdowns() {
    setTimeout(() => {
      this.showOriginDropdown.set(false);
      this.showDestDropdown.set(false);
    }, 200);
  }
}
