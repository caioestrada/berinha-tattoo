import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookingFlowService } from '../booking-flow.service';
import { BookingService } from '../booking.service';
import { TATTOO_SIZES, TattooSize } from '../booking.model';
import { formatShortDate } from '../date-format.util';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent {
  readonly bookingFlow = inject(BookingFlowService);
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  readonly sizes = TATTOO_SIZES;

  readonly dateTimeLabel = computed(() => {
    const date = this.bookingFlow.selectedDate();
    const time = this.bookingFlow.selectedTime();
    return date && time ? `${formatShortDate(date)} · ${time}` : '';
  });

  readonly canSubmit = computed(
    () => this.bookingFlow.clientName().trim().length > 0 && this.bookingFlow.description().trim().length > 0,
  );

  onNameInput(value: string): void {
    this.bookingFlow.clientName.set(value);
  }

  onDescriptionInput(value: string): void {
    this.bookingFlow.description.set(value);
  }

  onReferenceLinkInput(value: string): void {
    this.bookingFlow.referenceLink.set(value);
  }

  selectSize(size: TattooSize): void {
    this.bookingFlow.size.set(size);
  }

  goBack(): void {
    this.router.navigate(['/agendar/calendario']);
  }

  submit(): void {
    if (!this.canSubmit()) return;
    const date = this.bookingFlow.selectedDate();
    const time = this.bookingFlow.selectedTime();
    if (!date || !time) {
      this.router.navigate(['/agendar/calendario']);
      return;
    }

    const referenceLink = this.bookingFlow.referenceLink().trim();
    const booking = this.bookingService.create({
      clientName: this.bookingFlow.clientName().trim(),
      date,
      time,
      size: this.bookingFlow.size(),
      description: this.bookingFlow.description().trim(),
      ...(referenceLink ? { referenceLink } : {}),
    });

    this.bookingFlow.submit(booking);
    this.router.navigate(['/agendar/confirmacao']);
  }
}
