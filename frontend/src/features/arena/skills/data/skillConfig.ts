import type { NodeStatus } from './progressionConfig';

export type SkillFilter = 'all' | NodeStatus;

export const SKILL_FILTER_TABS: { id: SkillFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'available', label: 'Disponibles' },
  { id: 'in-progress', label: 'En cours' },
  { id: 'completed', label: 'Terminés' },
  { id: 'locked', label: 'Verrouillés' },
];

export const SKILL_STATUS_CONFIG: Record<
  NodeStatus,
  { label: string; color: string }
> = {
  available: { label: 'Disponible', color: '#5e6ad2' },
  'in-progress': { label: 'En cours', color: '#f2c94c' },
  completed: { label: 'Terminé', color: '#5e6ad2' },
  locked: { label: 'Verrouillé', color: '#6b7280' },
};

export const SKILL_LEVEL_LABELS: Record<string, string> = {
  novice: 'Novice',
  junior: 'Junior',
  confirmé: 'Confirmé',
  expert: 'Expert',
  architecte: 'Architecte',
};
