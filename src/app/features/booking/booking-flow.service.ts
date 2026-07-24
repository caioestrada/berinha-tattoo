import { Injectable, computed, signal } from '@angular/core';
import { Booking, TattooSize } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingFlowService {
  readonly selectedDate = signal<string | null>(null);
  readonly selectedTime = signal<string | null>(null);
  readonly clientName = signal('');
  readonly size = signal<TattooSize>('M');
  readonly description = signal('');
  readonly referenceLink = signal('');
  readonly submittedBooking = signal<Booking | null>(null);

  readonly hasDateTime = computed(() => !!this.selectedDate() && !!this.selectedTime());
  readonly hasSubmission = computed(() => !!this.submittedBooking());

  selectDateTime(date: string, time: string): void {
    this.selectedDate.set(date);
    this.selectedTime.set(time);
  }

  submit(booking: Booking): void {
    this.submittedBooking.set(booking);
  }

  /** Clears the wizard so a fresh visit to /agendar starts from the calendar again. */
  reset(): void {
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.clientName.set('');
    this.size.set('M');
    this.description.set('');
    this.referenceLink.set('');
    this.submittedBooking.set(null);
  }
}
