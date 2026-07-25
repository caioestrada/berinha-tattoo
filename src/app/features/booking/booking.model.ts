import { PortfolioCategory } from '../portfolio/portfolio-item.model';

export type TattooSize = 'P' | 'M' | 'G' | 'XL';

export const TATTOO_SIZES: { value: TattooSize; label: string; hint: string }[] = [
  { value: 'P', label: 'P', hint: 'até 5cm' },
  { value: 'M', label: 'M', hint: '5–15cm' },
  { value: 'G', label: 'G', hint: '15–30cm' },
  { value: 'XL', label: 'XL', hint: '30cm+' },
];

export const TATTOO_SIZE_LABELS: Record<TattooSize, string> = {
  P: 'Pequeno (até 5cm)',
  M: 'Médio (5–15cm)',
  G: 'Grande (15–30cm)',
  XL: 'Extra grande (30cm+)',
};

export type BookingStatus = 'pendente' | 'aprovado' | 'recusado';

export interface Booking {
  id: string;
  clientName: string;
  /** ISO date, e.g. '2026-07-16'. */
  date: string;
  /** 'HH:mm'. */
  time: string;
  size: TattooSize;
  description: string;
  referenceLink?: string;
  /** Estilo do pedido; ausente quando o cliente não indicou (fluxo público ainda não coleta isso). */
  category?: PortfolioCategory;
  status: BookingStatus;
  createdAt: string;
}
