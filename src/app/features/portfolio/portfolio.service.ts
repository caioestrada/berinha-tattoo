import { Injectable, signal } from '@angular/core';
import { PortfolioCategory, PortfolioItem } from './portfolio-item.model';

const SEED_ITEMS: PortfolioItem[] = [
  { id: 'retrato-gato', label: 'retrato gato · realismo', category: 'retratos', seed: 0 },
  { id: 'flor', label: 'flor', category: 'realismo', seed: 1 },
  { id: 'olho', label: 'olho', category: 'realismo', seed: 2 },
  { id: 'leao', label: 'leão', category: 'animais', seed: 3 },
  { id: 'lua', label: 'lua', category: 'realismo', seed: 4 },
  { id: 'retrato-humano', label: 'retrato humano', category: 'retratos', seed: 5 },
  { id: 'coruja', label: 'coruja', category: 'animais', seed: 1 },
  { id: 'mandala', label: 'mandala', category: 'realismo', seed: 2 },
  { id: 'casal', label: 'casal', category: 'retratos', seed: 3 },
];

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly items = signal<PortfolioItem[]>(SEED_ITEMS);

  readonly all = this.items.asReadonly();

  byCategory(category: PortfolioCategory | 'todos') {
    const list = this.items();
    return category === 'todos' ? list : list.filter((item) => item.category === category);
  }

  recent(count: number): PortfolioItem[] {
    return this.items().slice(0, count);
  }
}
