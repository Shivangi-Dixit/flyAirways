import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../core/services/flight.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss']
})
export class BookingModalComponent {
  @Input() flight: Flight | null = null;
  @Output() onClose = new EventEmitter<void>();
  
  guests = signal(1);
  isProcessing = signal(false);
  isSuccess = signal(false);
  pnr = signal('');

  networkFee = computed(() => (this.flight?.price || 0) * 0.1);
  totalValue = computed(() => (this.flight?.price || 0) * this.guests() * 1.1);

  confirm() {
    this.isProcessing.set(true);
    setTimeout(() => {
      this.isProcessing.set(false);
      this.isSuccess.set(true);
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let ref = '';
      for (let i = 0; i < 6; i++) {
        ref += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.pnr.set("AX-" + ref);
    }, 1500);
  }
}
