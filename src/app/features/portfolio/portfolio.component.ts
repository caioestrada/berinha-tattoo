import { Component, computed, inject, signal } from '@angular/core';
import { PlaceholderImageComponent } from '../../shared/ui/placeholder-image/placeholder-image.component';
import { PortfolioCategory } from './portfolio-item.model';
import { PortfolioService } from './portfolio.service';

type FilterValue = PortfolioCategory | 'todos';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [PlaceholderImageComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly filters: { value: FilterValue; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'realismo', label: 'Realismo' },
    { value: 'animais', label: 'Animais' },
    { value: 'retratos', label: 'Retratos' },
  ];

  readonly activeFilter = signal<FilterValue>('todos');
  readonly totalCount = computed(() => this.portfolioService.all().length);
  readonly filteredItems = computed(() => this.portfolioService.byCategory(this.activeFilter()));

  selectFilter(value: FilterValue): void {
    this.activeFilter.set(value);
  }
}
