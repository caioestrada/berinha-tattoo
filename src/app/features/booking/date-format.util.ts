export const WEEKDAY_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** Parses a 'YYYY-MM-DD' string as a local date (avoids UTC off-by-one). */
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** e.g. 'Qua 16 Jul'. */
export function formatShortDate(iso: string): string {
  const date = parseIsoDate(iso);
  const weekday = WEEKDAY_ABBR[date.getDay()];
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  return `${weekday} ${date.getDate()} ${month}`;
}

/** e.g. 'Julho 2026'. */
export function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function weekdayHeaders(): string[] {
  return WEEKDAY_ABBR.map((day) => day.charAt(0));
}
