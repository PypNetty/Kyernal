import type { CSSProperties } from 'react';
import type { ResourceType } from './data/resourcesData';

export interface ResourcesTheme {
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

export function getResourcesTheme(dark: boolean): ResourcesTheme {
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

export function resourcesCssVars(theme: ResourcesTheme): CSSProperties {
  return {
    '--res-bg': theme.bg,
    '--res-detail-bg': theme.bgDetail,
    '--res-border': theme.border,
    '--res-text': theme.textMain,
    '--res-muted': theme.textMuted,
    '--res-faint': theme.textFaint,
    '--res-hover': theme.hoverBg,
    '--res-active': theme.activeBg,
    '--res-accent': theme.accent,
    '--res-surface': theme.surface,
  } as CSSProperties;
}

export const RESOURCE_TYPE_CONFIG: Record<
  ResourceType,
  { label: string; color: string; bg: string }
> = {
  doc: { label: 'Doc', color: '#4d8fff', bg: 'rgba(0,85,229,0.1)' },
  man: { label: 'Man', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  cours: { label: 'Cours', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  cheatsheet: { label: 'Cheatsheet', color: '#30a46c', bg: 'rgba(48,164,108,0.1)' },
  video: { label: 'Vidéo', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
};
