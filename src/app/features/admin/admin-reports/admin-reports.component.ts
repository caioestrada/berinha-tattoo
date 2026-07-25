import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Booking, TATTOO_SIZES } from '../../booking/booking.model';
import { BookingService } from '../../booking/booking.service';
import { formatShortDate, parseIsoDate, toIsoDate, WEEKDAY_ABBR } from '../../booking/date-format.util';
import { PortfolioCategory } from '../../portfolio/portfolio-item.model';
import { PortfolioService } from '../../portfolio/portfolio.service';
import { AuthService } from '../auth.service';

type ReportSection = 'funil' | 'dias' | 'horarios' | 'tamanhos' | 'estilos';

interface BarDatum {
  label: string;
  count: number;
  percent: number;
}

interface ComparisonDatum {
  label: string;
  demandCount: number;
  demandPercent: number;
  portfolioCount: number;
  portfolioPercent: number;
}

const CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  realismo: 'Realismo',
  animais: 'Animais',
  retratos: 'Retratos',
};

const TIME_SLOTS = ['10:00', '13:00', '15:00', '17:00'];

function toBars(labels: string[], counts: number[]): BarDatum[] {
  const max = Math.max(1, ...counts);
  return labels.map((label, i) => ({ label, count: counts[i], percent: Math.round((counts[i] / max) * 100) }));
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss',
})
export class AdminReportsComponent {
  private readonly bookingService = inject(BookingService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly bookings = this.bookingService.all;

  readonly todayLabel = formatShortDate(toIsoDate(new Date()));

  readonly sections: { value: ReportSection; label: string }[] = [
    { value: 'funil', label: 'Funil' },
    { value: 'dias', label: 'Dias da semana' },
    { value: 'horarios', label: 'Horários' },
    { value: 'tamanhos', label: 'Tamanhos' },
    { value: 'estilos', label: 'Estilos' },
  ];

  readonly activeSection = signal<ReportSection>('funil');

  selectSection(section: ReportSection): void {
    this.activeSection.set(section);
  }

  readonly totalCount = computed(() => this.bookings().length);
  readonly pendingCount = computed(() => this.countByStatus('pendente'));
  readonly approvedCount = computed(() => this.countByStatus('aprovado'));
  readonly rejectedCount = computed(() => this.countByStatus('recusado'));

  readonly conversionRate = computed(() => {
    const total = this.totalCount();
    return total === 0 ? 0 : Math.round((this.approvedCount() / total) * 100);
  });

  readonly weekdayBars = computed<BarDatum[]>(() => {
    const counts = WEEKDAY_ABBR.map((_, day) => this.bookings().filter((b) => parseIsoDate(b.date).getDay() === day).length);
    return toBars(WEEKDAY_ABBR, counts);
  });

  readonly timeSlotBars = computed<BarDatum[]>(() => {
    const counts = TIME_SLOTS.map((slot) => this.bookings().filter((b) => b.time === slot).length);
    return toBars(TIME_SLOTS, counts);
  });

  readonly sizeBars = computed<BarDatum[]>(() => {
    const counts = TATTOO_SIZES.map((size) => this.bookings().filter((b) => b.size === size.value).length);
    return toBars(TATTOO_SIZES.map((size) => size.label), counts);
  });

  readonly avgLeadDays = computed(() => {
    const list = this.bookings();
    if (list.length === 0) return 0;
    const totalDays = list.reduce((sum, booking) => sum + this.leadDays(booking), 0);
    return Math.round(totalDays / list.length);
  });

  readonly categoryDemandBars = computed<BarDatum[]>(() => {
    const categories = Object.keys(CATEGORY_LABELS) as PortfolioCategory[];
    const labels = [...categories.map((c) => CATEGORY_LABELS[c]), 'Não especificado'];
    const counts = [
      ...categories.map((c) => this.bookings().filter((b) => b.category === c).length),
      this.bookings().filter((b) => !b.category).length,
    ];
    return toBars(labels, counts);
  });

  readonly categoryComparison = computed<ComparisonDatum[]>(() => {
    const categories = Object.keys(CATEGORY_LABELS) as PortfolioCategory[];
    const demandCounts = categories.map((c) => this.bookings().filter((b) => b.category === c).length);
    const portfolioCounts = categories.map((c) => this.portfolioService.byCategory(c).length);
    const max = Math.max(1, ...demandCounts, ...portfolioCounts);
    return categories.map((c, i) => ({
      label: CATEGORY_LABELS[c],
      demandCount: demandCounts[i],
      demandPercent: Math.round((demandCounts[i] / max) * 100),
      portfolioCount: portfolioCounts[i],
      portfolioPercent: Math.round((portfolioCounts[i] / max) * 100),
    }));
  });

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  private countByStatus(status: Booking['status']): number {
    return this.bookings().filter((b) => b.status === status).length;
  }

  private leadDays(booking: Booking): number {
    const created = new Date(booking.createdAt);
    const createdStart = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    const target = parseIsoDate(booking.date);
    const diffMs = target.getTime() - createdStart.getTime();
    return Math.max(0, Math.round(diffMs / 86_400_000));
  }
}
