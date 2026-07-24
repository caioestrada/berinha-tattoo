export type PortfolioCategory = 'realismo' | 'animais' | 'retratos';

export interface PortfolioItem {
  id: string;
  label: string;
  category: PortfolioCategory;
  /** Feeds PlaceholderImageComponent's stripe variant and the masonry aspect ratio. */
  seed: number;
  /** Path under public/images/portfolio; falls back to the placeholder stripe when absent. */
  image?: string;
}
