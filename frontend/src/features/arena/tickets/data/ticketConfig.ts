export type TicketStatus = 'en-cours' | 'a-faire' | 'resolu' | 'annule';
export type TicketPriority = 'urgent' | 'haute' | 'moyenne' | 'basse';
export type TicketFilter = 'all' | TicketStatus;

export const STATUS_ORDER: TicketStatus[] = [
  'en-cours',
  'a-faire',
  'resolu',
  'annule',
];

export const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; dot: string }
> = {
  'en-cours': {
    label: 'En cours',
    color: '#f2c94c',
    dot: '#f2c94c',
  },
  'a-faire': {
    label: 'À faire',
    color: '#8a8f98',
    dot: '#6b7280',
  },
  resolu: {
    label: 'Terminé',
    color: '#5e6ad2',
    dot: '#5e6ad2',
  },
  annule: {
    label: 'Annulé',
    color: '#95a2b3',
    dot: '#95a2b3',
  },
};

export const PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; color: string; filled: number }
> = {
  urgent: { label: 'Urgent', color: '#eb5757', filled: 4 },
  haute: { label: 'Haute', color: '#f2994a', filled: 3 },
  moyenne: { label: 'Moyenne', color: '#8a8f98', filled: 2 },
  basse: { label: 'Basse', color: '#6b7280', filled: 1 },
};

export const FILTER_TABS: { id: TicketFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'en-cours', label: 'En cours' },
  { id: 'a-faire', label: 'À faire' },
  { id: 'resolu', label: 'Terminés' },
  { id: 'annule', label: 'Annulés' },
];
