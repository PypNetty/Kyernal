import type { MessageType } from './data/inboxData';

export interface InboxTheme {
  bg: string;
  bgDetail: string;
  surface: string;
  border: string;
  textMain: string;
  textMuted: string;
  textFaint: string;
  hoverBg: string;
  activeBg: string;
  accent: string;
}

export function getInboxTheme(dark: boolean): InboxTheme {
  return dark
    ? {
        bg: '#0e0f11',
        bgDetail: '#111113',
        surface: 'rgba(255,255,255,0.04)',
        border: '#27282b',
        textMain: '#ededed',
        textMuted: '#8a8a93',
        textFaint: '#5c5c66',
        hoverBg: '#ffffff0a',
        activeBg: '#ffffff12',
        accent: '#4d8fff',
      }
    : {
        bg: '#f7f7f9',
        bgDetail: '#ffffff',
        surface: 'rgba(0,0,0,0.03)',
        border: '#e8e8e5',
        textMain: '#111113',
        textMuted: '#6b6b6b',
        textFaint: '#9a9a9a',
        hoverBg: '#00000008',
        activeBg: '#00000012',
        accent: '#0055e5',
      };
}

export const MESSAGE_TYPE_CONFIG: Record<
  MessageType,
  { label: string; accent: string; muted: string }
> = {
  incident: {
    label: 'Ticket assigné',
    accent: '#0055e5',
    muted: 'rgba(0,85,229,0.12)',
  },
  formateur: {
    label: 'Retour formateur',
    accent: '#30a46c',
    muted: 'rgba(48,164,108,0.12)',
  },
  system: {
    label: 'Notification système',
    accent: '#8a8a93',
    muted: 'rgba(138,138,147,0.15)',
  },
};
