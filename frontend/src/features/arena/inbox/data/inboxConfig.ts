import type { MessageType } from './inboxData';

export type InboxFilter = 'all' | MessageType;

export const INBOX_FILTER_TABS: { id: InboxFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'incident', label: 'Incidents' },
  { id: 'formateur', label: 'Formateur' },
  { id: 'system', label: 'Système' },
];

export const MESSAGE_TYPE_CONFIG: Record<
  MessageType,
  { label: string; color: string }
> = {
  incident: { label: 'Incident', color: '#5e6ad2' },
  formateur: { label: 'Formateur', color: '#30a46c' },
  system: { label: 'Système', color: '#8a8f98' },
};

export const tagColor = (tag: string): { bg: string; color: string } => {
  if (tag === 'Critique')
    return { bg: 'rgba(235,87,87,0.1)', color: '#eb5757' };
  if (tag === 'Moyen')
    return { bg: 'rgba(242,201,76,0.12)', color: '#d4a017' };
  if (tag === 'Avancé')
    return { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' };
  if (tag === 'Nouveau' || tag === 'Feedback')
    return { bg: 'rgba(48,164,108,0.1)', color: '#30a46c' };
  if (['CCP1', 'CCP2', 'CCP3'].includes(tag))
    return { bg: 'rgba(94,106,210,0.1)', color: '#5e6ad2' };
  return { bg: 'rgba(138,143,152,0.1)', color: '#8a8f98' };
};

export function incidentIdToRouteId(incidentId?: string): string | null {
  if (!incidentId) return null;
  return incidentId.replace(/^INC-/, '');
};
