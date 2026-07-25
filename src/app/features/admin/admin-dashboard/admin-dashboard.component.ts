import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Booking, TATTOO_SIZE_LABELS } from '../../booking/booking.model';
import { BookingService } from '../../booking/booking.service';
import { formatShortDate, toIsoDate } from '../../booking/date-format.util';
import { AuthService } from '../auth.service';

type FilterTab = 'pendente' | 'aprovado' | 'todos';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly tabs: { value: FilterTab; label: string }[] = [
    { value: 'pendente', label: 'Pendentes' },
    { value: 'aprovado', label: 'Aprovados' },
    { value: 'todos', label: 'Todos' },
  ];

  readonly activeTab = signal<FilterTab>('pendente');
  readonly todayLabel = formatShortDate(toIsoDate(new Date()));
  readonly pendingCount = this.bookingService.pendingCount;

  readonly visibleBookings = computed(() => {
    const tab = this.activeTab();
    const bookings = this.bookingService.all();
    return tab === 'todos' ? bookings : bookings.filter((b) => b.status === tab);
  });

  selectTab(tab: FilterTab): void {
    this.activeTab.set(tab);
  }

  approve(booking: Booking): void {
    this.bookingService.approve(booking.id);
  }

  reject(booking: Booking): void {
    this.bookingService.reject(booking.id);
  }

  dateTimeLabel(booking: Booking): string {
    return `${formatShortDate(booking.date)} · ${booking.time} · ${TATTOO_SIZE_LABELS[booking.size].split(' (')[0]}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
