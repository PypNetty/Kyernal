import React from 'react';
import type { FormationTicket } from '../skills/data/formationBundleTypes';

export type TicketStatus = FormationTicket['status'];
export type TicketPriority = FormationTicket['priority'];

export const DEFAULT_TICKET_DESCRIPTION =
  'Ouvre le lab pour diagnostiquer et corriger cet incident.';

export interface TicketTheme {
  bg: string;
  bgDetail: string;
  border: string;
  textMain: string;
  textMuted: string;
  hoverBg: string;
  activeBg: string;
  listHeaderBg: string;
  rowBorder: string;
}

export function getTicketTheme(dark: boolean): TicketTheme {
  return {
    bg: dark ? '#0e0f11' : '#f7f7f9',
    bgDetail: dark ? '#111113' : '#ffffff',
    border: dark ? '#1f1f1f' : '#e8e8e5',
    textMain: dark ? '#ededed' : '#111113',
    textMuted: dark ? '#8a8a93' : '#6b6b6b',
    hoverBg: dark ? '#ffffff0a' : '#00000008',
    activeBg: dark ? '#ffffff12' : '#00000012',
    listHeaderBg: dark ? '#0c0c0d' : '#fafaf9',
    rowBorder: dark ? '#1f1f1f' : '#f0f0ee',
  };
}

export const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  'en-cours': {
    label: 'En cours',
    color: '#f59e0b',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  'a-faire': {
    label: 'À faire',
    color: '#8a8a93',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  resolu: {
    label: 'Résolu',
    color: '#30a46c',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  annule: {
    label: 'Annulé',
    color: '#ef4444',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  verrouille: {
    label: 'Backlog',
    color: '#52525b',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
};

export const PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; color: string; icon: React.ReactNode }
> = {
  urgent: {
    label: 'Urgent',
    color: '#ef4444',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 19h20L12 2zm0 3.5L19.5 18h-15L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
      </svg>
    ),
  },
  haute: {
    label: 'Haute',
    color: '#f97316',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    ),
  },
  moyenne: {
    label: 'Moyenne',
    color: '#8a8a93',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  basse: {
    label: 'Basse',
    color: '#6b7280',
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    ),
  },
};

export function ticketCompetenceLabel(
  ticket: FormationTicket,
  showReferential: boolean,
): string {
  return showReferential
    ? `${ticket.ccpCode} · ${ticket.competenceCode}`
    : ticket.competenceCode;
}
