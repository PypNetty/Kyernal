import React from 'react';
import { Link } from '@tanstack/react-router';
import type {
  FormationTicket,
  TicketObjective,
} from '../../skills/data/formationBundleTypes';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  getTicketTheme,
  ticketCompetenceLabel,
  type TicketTheme,
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

function SidebarField({
  label,
  children,
  textMuted,
}: {
  label: string;
  children: React.ReactNode;
  textMuted: string;
}) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: textMuted,
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function TicketObjectivesList({
  objectives,
  theme,
}: {
  objectives: TicketObjective[];
  theme: TicketTheme;
}) {
  if (objectives.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: theme.textMain,
          marginBottom: '10px',
        }}
      >
        Objectifs
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {objectives.map((obj, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '13px',
              color: theme.textMuted,
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                color: theme.textMuted,
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              ○
            </span>
            {obj.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TicketDetailSidebar({
  ticket,
  theme,
  showReferential,
  mode,
  vmHost,
  loading,
}: {
  ticket: FormationTicket;
  theme: TicketTheme;
  showReferential: boolean;
  mode: 'browse' | 'session';
  vmHost?: string | null;
  loading?: boolean;
}) {
  const statusCfg = STATUS_CONFIG[ticket.status];
  const priorityCfg = PRIORITY_CONFIG[ticket.priority];
  const competence = ticketCompetenceLabel(ticket, showReferential);

  return (
    <div
      style={{
        width: '220px',
        flexShrink: 0,
        paddingLeft: '24px',
        borderLeft: `1px solid ${theme.border}`,
      }}
    >
      <SidebarField label="Statut" textMuted={theme.textMuted}>
        <StatusPill
          label={statusCfg.label}
          color={statusCfg.color}
          icon={statusCfg.icon}
        />
      </SidebarField>

      <SidebarField label="Priorité" textMuted={theme.textMuted}>
        <StatusPill
          label={priorityCfg.label}
          color={priorityCfg.color}
          icon={priorityCfg.icon}
        />
      </SidebarField>

      <SidebarField label="Compétence" textMuted={theme.textMuted}>
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
      </SidebarField>

      <SidebarField label="Mis à jour" textMuted={theme.textMuted}>
        <span style={{ fontSize: '12px', color: theme.textMain }}>
          {ticket.updatedAt}
        </span>
      </SidebarField>

      {mode === 'session' && (
        <SidebarField label="Connexion" textMuted={theme.textMuted}>
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
        </SidebarField>
      )}
    </div>
  );
}

function SessionPropertyPills({
  ticket,
  theme,
  showReferential,
  vmHost,
  loading,
}: {
  ticket: FormationTicket;
  theme: TicketTheme;
  showReferential: boolean;
  vmHost?: string | null;
  loading?: boolean;
}) {
  const statusCfg = STATUS_CONFIG[ticket.status];
  const priorityCfg = PRIORITY_CONFIG[ticket.priority];
  const competence = ticketCompetenceLabel(ticket, showReferential);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginTop: '12px',
      }}
    >
      <StatusPill
        label={statusCfg.label}
        color={statusCfg.color}
        icon={statusCfg.icon}
      />
      <StatusPill
        label={priorityCfg.label}
        color={priorityCfg.color}
        icon={priorityCfg.icon}
      />
      <span
        style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '4px',
          background: 'rgba(0,85,229,0.1)',
          color: '#4d8fff',
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {competence}
      </span>
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
    </div>
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

  const isLocked = ticket.status === 'verrouille';
  const description = ticket.description ?? '';
  const objectives = ticket.objectives ?? [];

  const renderBrowseActions = () => {
    if (isLocked) {
      return (
        <p
          style={{
            margin: '28px 0 0',
            fontSize: '12px',
            color: theme.textMuted,
            lineHeight: 1.55,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: '2px' }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>
            Ce ticket est dans le backlog — termine les tickets précédents pour
            le débloquer.
          </span>
        </p>
      );
    }

    return (
      <button
        type="button"
        onClick={onOpenLab}
        style={{
          marginTop: '28px',
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
        <div style={{ marginTop: '28px' }}>
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
            margin: '28px 0 0',
            fontSize: '12px',
            color: theme.textMuted,
            lineHeight: 1.55,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: '2px' }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>
            Ce ticket est dans le backlog — termine les tickets précédents pour
            le débloquer.
          </span>
        </p>
      );
    }

    if (resolveState === 'unknown') {
      return (
        <p
          style={{
            margin: '28px 0 0',
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
          marginTop: '28px',
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

  const mainContent = (
    <div style={{ flex: 1, minWidth: 0 }}>
      {mode === 'browse' && (
        <div
          style={{
            fontSize: '11px',
            color: theme.textMuted,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Link
            to="/tickets"
            style={{ color: theme.textMuted, textDecoration: 'none' }}
          >
            Mes tickets
          </Link>
          <span>›</span>
          <span>{ticket.id}</span>
        </div>
      )}

      <h1
        style={{
          margin: 0,
          fontSize: mode === 'browse' ? '18px' : '15px',
          fontWeight: 600,
          color: theme.textMain,
          lineHeight: 1.35,
        }}
      >
        {ticket.title}
      </h1>

      {mode === 'session' && (
        <SessionPropertyPills
          ticket={ticket}
          theme={theme}
          showReferential={showReferential}
          vmHost={vmHost}
          loading={loading}
        />
      )}

      <p
        style={{
          margin: '16px 0 0',
          fontSize: '13px',
          color: theme.textMuted,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>

      <TicketObjectivesList objectives={objectives} theme={theme} />

      {mode === 'browse' ? renderBrowseActions() : renderSessionActions()}
    </div>
  );

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
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {mode === 'browse' ? (
          <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start' }}>
            {mainContent}
            <TicketDetailSidebar
              ticket={ticket}
              theme={theme}
              showReferential={showReferential}
              mode={mode}
              vmHost={vmHost}
              loading={loading}
            />
          </div>
        ) : (
          mainContent
        )}
      </div>
    </div>
  );
}
