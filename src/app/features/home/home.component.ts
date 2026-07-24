import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlaceholderImageComponent } from '../../shared/ui/placeholder-image/placeholder-image.component';
import { PortfolioService } from '../portfolio/portfolio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, PlaceholderImageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly portfolioService = inject(PortfolioService);

  readonly stats = [
    { value: '120+', label: 'tatuagens' },
    { value: '5 anos', label: 'experiência' },
    { value: '★ 4.9', label: 'avaliações' },
  ];

  readonly recentWork = computed(() => this.portfolioService.recent(3));
}
