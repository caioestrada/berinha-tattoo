export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface CalendarDay {
  date: Date;
  iso: string;
  dayOfMonth: number;
  available: boolean;
  isToday: boolean;
  isPast: boolean;
}
