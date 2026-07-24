import { Injectable, computed, signal } from '@angular/core';
import { toIsoDate } from '../date-format.util';
import { CalendarDay, TimeSlot } from './time-slot.model';

const DAILY_SLOTS = ['10:00', '13:00', '15:00', '17:00'];
/** The last slot of the day is always shown as already booked, matching the prototype. */
const BOOKED_SLOT = '17:00';

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Sparse, deterministic mock availability (~35% of days), so the calendar doesn't
 * look fully booked out or fully open. No real scheduling backend behind this yet.
 */
function isDayAvailable(date: Date): boolean {
  return (date.getDate() * 7) % 11 < 4;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private readonly today = startOfDay(new Date());
  readonly viewedMonth = signal<Date>(startOfMonth(this.today));

  readonly canGoToPreviousMonth = computed(() => this.viewedMonth() > startOfMonth(this.today));

  readonly calendarDays = computed<(CalendarDay | null)[]>(() => {
    const monthStart = this.viewedMonth();
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = monthStart.getDay();

    const cells: (CalendarDay | null)[] = Array.from({ length: leadingBlanks }, () => null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = date < this.today;
      cells.push({
        date,
        iso: toIsoDate(date),
        dayOfMonth: day,
        available: !isPast && isDayAvailable(date),
        isToday: date.getTime() === this.today.getTime(),
        isPast,
      });
    }

    return cells;
  });

  goToPreviousMonth(): void {
    if (!this.canGoToPreviousMonth()) return;
    const current = this.viewedMonth();
    this.viewedMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  goToNextMonth(): void {
    const current = this.viewedMonth();
    this.viewedMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  timeSlotsFor(iso: string): TimeSlot[] {
    const day = this.calendarDays().find((d) => d?.iso === iso);
    if (!day?.available) return [];
    return DAILY_SLOTS.map((time) => ({ time, available: time !== BOOKED_SLOT }));
  }
}
