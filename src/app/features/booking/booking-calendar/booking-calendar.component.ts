import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookingFlowService } from '../booking-flow.service';
import { formatMonthYear, formatShortDate, weekdayHeaders } from '../date-format.util';
import { AvailabilityService } from './availability.service';
import { CalendarDay, TimeSlot } from './time-slot.model';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  templateUrl: './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.scss',
})
export class BookingCalendarComponent {
  private readonly availability = inject(AvailabilityService);
  private readonly bookingFlow = inject(BookingFlowService);
  private readonly router = inject(Router);

  readonly weekdayHeaders = weekdayHeaders();
  readonly days = this.availability.calendarDays;
  readonly monthLabel = computed(() => formatMonthYear(this.availability.viewedMonth()));
  readonly canGoPreviousMonth = this.availability.canGoToPreviousMonth;

  readonly focusedDate = signal<string | null>(null);
  readonly focusedTime = signal<string | null>(null);

  readonly slots = computed<TimeSlot[]>(() => {
    const date = this.focusedDate();
    return date ? this.availability.timeSlotsFor(date) : [];
  });

  readonly focusedDateLabel = computed(() => {
    const date = this.focusedDate();
    return date ? formatShortDate(date) : '';
  });

  readonly canProceed = computed(() => !!this.focusedDate() && !!this.focusedTime());

  constructor() {
    const existingDate = this.bookingFlow.selectedDate();
    if (existingDate) {
      this.focusedDate.set(existingDate);
      this.focusedTime.set(this.bookingFlow.selectedTime());
      return;
    }

    const firstAvailable = this.days().find((day): day is CalendarDay => !!day?.available);
    if (firstAvailable) {
      this.selectDay(firstAvailable);
    }
  }

  selectDay(day: CalendarDay): void {
    if (!day.available) return;
    this.focusedDate.set(day.iso);
    const firstAvailableSlot = this.availability.timeSlotsFor(day.iso).find((slot) => slot.available);
    this.focusedTime.set(firstAvailableSlot?.time ?? null);
  }

  selectTime(slot: TimeSlot): void {
    if (!slot.available) return;
    this.focusedTime.set(slot.time);
  }

  goPreviousMonth(): void {
    this.availability.goToPreviousMonth();
  }

  goNextMonth(): void {
    this.availability.goToNextMonth();
  }

  proceed(): void {
    if (!this.canProceed()) return;
    this.bookingFlow.selectDateTime(this.focusedDate()!, this.focusedTime()!);
    this.router.navigate(['/agendar/formulario']);
  }
}
