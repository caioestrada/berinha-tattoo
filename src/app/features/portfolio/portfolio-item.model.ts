export type PortfolioCategory = 'realismo' | 'animais' | 'retratos';

export interface PortfolioItem {
  id: string;
  label: string;
  category: PortfolioCategory;
  /** Feeds PlaceholderImageComponent's stripe variant and the masonry aspect ratio. */
  seed: number;
}
