import { Injectable, computed, signal } from '@angular/core';
import { Booking } from './booking.model';

const SEED_BOOKINGS: Booking[] = [
  {
    id: 'seed-ana',
    clientName: 'Ana Souza',
    date: '2026-07-16',
    time: '10:00',
    size: 'M',
    description: 'Retrato realista do meu gato, pelo longo, fundo neutro...',
    referenceLink: 'https://pinterest.com/pin/exemplo-gato',
    category: 'animais',
    status: 'pendente',
    createdAt: '2026-07-10T14:00:00.000Z',
  },
  {
    id: 'seed-joao',
    clientName: 'João Lima',
    date: '2026-07-18',
    time: '15:00',
    size: 'G',
    description: 'Leão realista, peito, cobrindo omoplata...',
    category: 'animais',
    status: 'pendente',
    createdAt: '2026-07-11T09:30:00.000Z',
  },
  {
    id: 'seed-maria',
    clientName: 'Maria Clara',
    date: '2026-07-21',
    time: '13:00',
    size: 'P',
    description: 'Flor minimalista no tornozelo',
    category: 'realismo',
    status: 'aprovado',
    createdAt: '2026-07-08T11:15:00.000Z',
  },
  {
    id: 'seed-pedro',
    clientName: 'Pedro Alves',
    date: '2026-06-25',
    time: '17:00',
    size: 'XL',
    description: 'Retrato do meu avô, fotorrealismo, antebraço inteiro',
    category: 'retratos',
    status: 'aprovado',
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'seed-carla',
    clientName: 'Carla Nunes',
    date: '2026-07-09',
    time: '10:00',
    size: 'M',
    description: 'Coruja realista na panturrilha',
    category: 'animais',
    status: 'recusado',
    createdAt: '2026-06-28T16:20:00.000Z',
  },
  {
    id: 'seed-bruno',
    clientName: 'Bruno Costa',
    date: '2026-07-23',
    time: '13:00',
    size: 'G',
    description: 'Mandala geométrica nas costas',
    category: 'realismo',
    status: 'pendente',
    createdAt: '2026-07-15T08:45:00.000Z',
  },
  {
    id: 'seed-fernanda',
    clientName: 'Fernanda Reis',
    date: '2026-08-01',
    time: '15:00',
    size: 'P',
    description: 'Olho realista no pulso',
    category: 'realismo',
    status: 'aprovado',
    createdAt: '2026-07-20T12:00:00.000Z',
  },
  {
    id: 'seed-lucas',
    clientName: 'Lucas Prado',
    date: '2026-08-05',
    time: '10:00',
    size: 'M',
    description: 'Casal em retrato, referência anexada',
    status: 'pendente',
    createdAt: '2026-07-22T09:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly bookings = signal<Booking[]>(SEED_BOOKINGS);

  readonly all = this.bookings.asReadonly();
  readonly pendingCount = computed(() => this.bookings().filter((b) => b.status === 'pendente').length);

  create(input: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
    const booking: Booking = {
      ...input,
      id: `booking-${Date.now()}`,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };
    this.bookings.update((list) => [booking, ...list]);
    return booking;
  }

  approve(id: string): void {
    this.setStatus(id, 'aprovado');
  }

  reject(id: string): void {
    this.setStatus(id, 'recusado');
  }

  private setStatus(id: string, status: Booking['status']): void {
    this.bookings.update((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
  }
}
