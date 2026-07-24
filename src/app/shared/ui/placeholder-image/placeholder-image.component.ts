import { Component, Input } from '@angular/core';

const STRIPE_PAIRS = [
  ['#1a1714', '#201e19'],
  ['#1c1a15', '#222018'],
  ['#191714', '#1f1d18'],
  ['#1b1916', '#211f1a'],
  ['#1a1814', '#201e18'],
  ['#1d1b17', '#231f1a'],
];

@Component({
  selector: 'app-placeholder-image',
  standalone: true,
  templateUrl: './placeholder-image.component.html',
  styleUrl: './placeholder-image.component.scss',
})
export class PlaceholderImageComponent {
  /** Small caption rendered in the center, e.g. "retrato gato". */
  @Input() label = 'foto';
  /** Picks a stripe color variant so grids don't look uniform. */
  @Input() seed = 0;
  /** When set, renders the real photo instead of the placeholder stripe. */
  @Input() image?: string;

  get background(): string {
    const [a, b] = STRIPE_PAIRS[this.seed % STRIPE_PAIRS.length];
    return `repeating-linear-gradient(-45deg, ${a} 0, ${a} 4px, ${b} 0, ${b} 18px)`;
  }
}
