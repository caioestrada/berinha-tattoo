import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookingFlowService } from '../booking-flow.service';
import { TATTOO_SIZE_LABELS } from '../booking.model';
import { formatShortDate } from '../date-format.util';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  templateUrl: './booking-confirmation.component.html',
  styleUrl: './booking-confirmation.component.scss',
})
export class BookingConfirmationComponent {
  private readonly bookingFlow = inject(BookingFlowService);
  private readonly router = inject(Router);

  readonly booking = this.bookingFlow.submittedBooking;

  readonly dateTimeLabel = computed(() => {
    const booking = this.booking();
    return booking ? `${formatShortDate(booking.date)} · ${booking.time}` : '';
  });

  readonly sizeLabel = computed(() => {
    const booking = this.booking();
    return booking ? TATTOO_SIZE_LABELS[booking.size] : '';
  });

  backToHome(): void {
    this.bookingFlow.reset();
    this.router.navigate(['/']);
  }
}
