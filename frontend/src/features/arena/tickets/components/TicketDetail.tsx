import React from 'react';
import { Link } from '@tanstack/react-router';
import type { FormationTicket } from '../../skills/data/formationBundleTypes';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  getTicketTheme,
  ticketCompetenceLabel,
} from '../ticketUi';

export type TicketResolveState =
  | 'available'
  | 'resolved'
  | 'locked'
  | 'unknown';

interface TicketDetailProps {
  ticket: FormationTicket | null;
  dark: boolean;
  showReferential: boolean;
  mode: 'browse' | 'session';
  vmHost?: string | null;
  loading?: boolean;
  resolveState?: TicketResolveState;
  onOpenLab?: () => void;
  onResolve?: () => void | Promise<void>;
  resolving?: boolean;
}

function PropertyRow({
  label,
  children,
  textMuted,
}: {
  label: string;
  children: React.ReactNode;
  textMuted: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '28px',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          color: textMuted,
          fontWeight: 500,
          minWidth: '88px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function StatusPill({
  label,
  color,
  icon,
}: {
  label: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '12px',
        fontWeight: 500,
        color,
        padding: '2px 8px',
        borderRadius: '6px',
        background: `${color}18`,
      }}
    >
      {icon}
      {label}
    </span>
  );
}

export default function TicketDetail({
  ticket,
  dark,
  showReferential,
  mode,
  vmHost,
  loading = false,
  resolveState = 'available',
  onOpenLab,
  onResolve,
  resolving = false,
}: TicketDetailProps) {
  const theme = getTicketTheme(dark);

  if (!ticket) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.textMuted,
          fontSize: '13px',
          background: theme.bgDetail,
        }}
      >
        Sélectionne un ticket
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[ticket.status];
  const priorityCfg = PRIORITY_CONFIG[ticket.priority];
  const competence = ticketCompetenceLabel(ticket, showReferential);
  const isLocked = ticket.status === 'verrouille';

  const renderBrowseActions = () => {
    if (isLocked) {
      return (
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: theme.textMuted,
            lineHeight: 1.55,
          }}
        >
          Ce ticket est dans le backlog — termine les tickets précédents pour le
          débloquer.
        </p>
      );
    }

    return (
      <button
        type="button"
        onClick={onOpenLab}
        style={{
          height: '32px',
          padding: '0 14px',
          border: 'none',
          borderRadius: '6px',
          background: '#0055e5',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Ouvrir le lab
      </button>
    );
  };

  const renderSessionActions = () => {
    if (resolveState === 'resolved') {
      return (
        <div>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 600,
              color: '#30a46c',
            }}
          >
            Ticket résolu
          </p>
          <Link
            to="/tickets"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '12px',
              color: '#0055e5',
              textDecoration: 'none',
            }}
          >
            Retour à Mes tickets
          </Link>
        </div>
      );
    }

    if (resolveState === 'locked') {
      return (
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: theme.textMuted,
            lineHeight: 1.55,
          }}
        >
          Ce ticket est dans le backlog — termine les tickets précédents pour le
          débloquer.
        </p>
      );
    }

    if (resolveState === 'unknown') {
      return (
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: theme.textMuted,
            lineHeight: 1.55,
          }}
        >
          Ce ticket n&apos;appartient pas à ton parcours actuel.
        </p>
      );
    }

    return (
      <button
        type="button"
        disabled={resolving}
        onClick={() => void onResolve?.()}
        style={{
          height: '32px',
          padding: '0 14px',
          border: `1px solid ${theme.border}`,
          borderRadius: '6px',
          background: 'transparent',
          color: theme.textMain,
          fontSize: '12px',
          fontWeight: 600,
          cursor: resolving ? 'wait' : 'pointer',
          opacity: resolving ? 0.6 : 1,
        }}
      >
        {resolving ? 'Résolution…' : 'Marquer comme résolu'}
      </button>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: theme.bgDetail,
        minWidth: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      <div
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: `1px solid ${theme.border}`,
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: theme.textMain,
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ticket.id} · {ticket.title}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {mode === 'browse' && (
          <div
            style={{
              fontSize: '11px',
              color: theme.textMuted,
              marginBottom: '20px',
            }}
          >
            Mes tickets
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <PropertyRow label="Statut" textMuted={theme.textMuted}>
            <StatusPill
              label={statusCfg.label}
              color={statusCfg.color}
              icon={statusCfg.icon}
            />
          </PropertyRow>

          <PropertyRow label="Priorité" textMuted={theme.textMuted}>
            <StatusPill
              label={priorityCfg.label}
              color={priorityCfg.color}
              icon={priorityCfg.icon}
            />
          </PropertyRow>

          <PropertyRow label="Compétence" textMuted={theme.textMuted}>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(0,85,229,0.1)',
                color: '#4d8fff',
                fontWeight: 500,
              }}
            >
              {competence}
            </span>
          </PropertyRow>

          <PropertyRow label="Mis à jour" textMuted={theme.textMuted}>
            <span style={{ fontSize: '12px', color: theme.textMain }}>
              {ticket.updatedAt}
            </span>
          </PropertyRow>

          {mode === 'session' && (
            <PropertyRow label="Connexion" textMuted={theme.textMuted}>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  border: `1px solid ${vmHost ? '#30a46c44' : '#f76b1544'}`,
                  color: vmHost ? '#30a46c' : '#f76b15',
                  background: vmHost ? '#30a46c0f' : '#f76b150f',
                  fontWeight: 500,
                }}
              >
                {loading
                  ? 'Provisionnement…'
                  : vmHost
                    ? '● VM active'
                    : '○ En attente'}
              </span>
            </PropertyRow>
          )}
        </div>

        <div style={{ height: '1px', background: theme.border, marginBottom: '20px' }} />

        <div style={{ maxWidth: '640px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: theme.textMuted,
              letterSpacing: '0.4px',
              marginBottom: '10px',
            }}
          >
            DESCRIPTION
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: theme.textMuted,
              lineHeight: 1.7,
            }}
          >
            {mode === 'browse'
              ? 'Ouvre le lab pour diagnostiquer et corriger cet incident.'
              : 'Session de lab en cours — utilise le terminal pour diagnostiquer et corriger.'}
          </p>
        </div>

        <div style={{ marginTop: '28px' }}>
          {mode === 'browse' ? renderBrowseActions() : renderSessionActions()}
        </div>
      </div>
    </div>
  );
}
