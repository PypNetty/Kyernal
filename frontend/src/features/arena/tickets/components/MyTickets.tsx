import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import type { FormationTicket } from '../../skills/data/formationBundleTypes';
import { getLearnerTickets } from '../../../progress';

// --- TYPES ---
type TicketStatus = FormationTicket['status'];
type TicketPriority = FormationTicket['priority'];

// --- STATUT CONFIG ---
const STATUS_CONFIG: Record<
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
};

// --- PRIORITÉ CONFIG ---
const PRIORITY_CONFIG: Record<
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

function ticketCompetenceLabel(
  ticket: FormationTicket,
  showReferential: boolean,
): string {
  return showReferential
    ? `${ticket.ccpCode} · ${ticket.competenceCode}`
    : ticket.competenceCode;
}

// --- COMPOSANT GROUPE ---
function TicketGroup({
  status,
  tickets,
  dark,
  showReferential,
  onTicketClick,
}: {
  status: TicketStatus;
  tickets: FormationTicket[];
  dark: boolean;
  showReferential: boolean;
  onTicketClick: (t: FormationTicket) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const cfg = STATUS_CONFIG[status];
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const border = dark ? '#1f1f1f' : '#f0f0ee';
  const hoverBg = dark ? '#ffffff07' : '#00000005';

  if (tickets.length === 0) return null;

  return (
    <div style={{ marginBottom: '4px' }}>
      {/* Header groupe */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = hoverBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* Chevron */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke={textMuted}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

        {/* Icône statut */}
        <span
          style={{ color: cfg.color, display: 'flex', alignItems: 'center' }}
        >
          {cfg.icon}
        </span>

        <span style={{ fontSize: '12px', fontWeight: 600, color: textMain }}>
          {cfg.label}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: textMuted,
            background: dark ? '#ffffff0f' : '#0000000a',
            padding: '1px 6px',
            borderRadius: '10px',
          }}
        >
          {tickets.length}
        </span>
      </div>

      {/* Lignes de tickets */}
      {!collapsed &&
        tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            competence={ticketCompetenceLabel(ticket, showReferential)}
            dark={dark}
            onClick={() => onTicketClick(ticket)}
            textMain={textMain}
            textMuted={textMuted}
            border={border}
            hoverBg={hoverBg}
          />
        ))}
    </div>
  );
}

// --- LIGNE TICKET ---
function TicketRow({
  ticket,
  competence,
  dark,
  onClick,
  textMain,
  textMuted,
  border,
  hoverBg,
}: {
  ticket: FormationTicket;
  competence: string;
  dark: boolean;
  onClick: () => void;
  textMain: string;
  textMuted: string;
  border: string;
  hoverBg: string;
}) {
  const [hovered, setHovered] = useState(false);
  const statusCfg = STATUS_CONFIG[ticket.status];
  const priorityCfg = PRIORITY_CONFIG[ticket.priority];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '5px 16px 5px 32px',
        borderBottom: `1px solid ${border}`,
        background: hovered ? hoverBg : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
    >
      {/* Priorité */}
      <span
        style={{
          color: priorityCfg.color,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        title={priorityCfg.label}
      >
        {priorityCfg.icon}
      </span>

      {/* Statut */}
      <span
        style={{
          color: statusCfg.color,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {statusCfg.icon}
      </span>

      {/* ID */}
      <span
        style={{
          fontSize: '11px',
          color: textMuted,
          fontWeight: 500,
          flexShrink: 0,
          minWidth: '60px',
        }}
      >
        {ticket.id}
      </span>

      {/* Titre */}
      <span
        style={{
          fontSize: '13px',
          color: textMain,
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          opacity: ticket.status === 'resolu' ? 0.5 : 1,
          textDecoration: ticket.status === 'resolu' ? 'line-through' : 'none',
        }}
      >
        {ticket.title}
      </span>

      {/* VM active badge */}
      {ticket.status === 'en-cours' && (
        <span
          style={{
            fontSize: '10px',
            padding: '1px 6px',
            borderRadius: '4px',
            background: 'rgba(48,164,108,0.12)',
            color: '#30a46c',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          ● VM active
        </span>
      )}

      {/* Compétence */}
      <span
        style={{
          fontSize: '10px',
          padding: '1px 6px',
          borderRadius: '4px',
          background: 'rgba(0,85,229,0.1)',
          color: '#4d8fff',
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        {competence}
      </span>

      {/* Date */}
      <span
        style={{
          fontSize: '11px',
          color: textMuted,
          flexShrink: 0,
          minWidth: '72px',
          textAlign: 'right',
        }}
      >
        {ticket.updatedAt}
      </span>
    </div>
  );
}

// --- PAGE PRINCIPALE ---
export default function MyTickets() {
  const { dark } = useContext(LayoutCtx);
  const navigate = useNavigate();
  const bundle = useFormationBundle();
  const showReferential = Boolean(bundle.referential);
  const tickets = getLearnerTickets(bundle);

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';

  const grouped: Record<TicketStatus, FormationTicket[]> = {
    'en-cours': tickets.filter((t) => t.status === 'en-cours'),
    'a-faire': tickets.filter((t) => t.status === 'a-faire'),
    resolu: tickets.filter((t) => t.status === 'resolu'),
    annule: tickets.filter((t) => t.status === 'annule'),
  };

  const handleTicketClick = (ticket: FormationTicket) => {
    navigate({ href: `/tickets/${ticket.incidentId}` });
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: `1px solid ${border}`,
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
          Mes tickets
        </span>
        <span
          style={{
            fontSize: '11px',
            color: textMuted,
            background: dark ? '#ffffff0f' : '#0000000a',
            padding: '1px 7px',
            borderRadius: '10px',
          }}
        >
          {
            tickets.filter(
              (t) => t.status !== 'resolu' && t.status !== 'annule',
            ).length
          }{' '}
          actifs
        </span>
      </div>

      {/* Colonne headers */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 16px 6px 32px',
          borderBottom: `1px solid ${border}`,
          background: dark ? '#0c0c0d' : '#fafaf9',
        }}
      >
        <span
          style={{ fontSize: '10px', color: textMuted, minWidth: '12px' }}
        />
        <span
          style={{ fontSize: '10px', color: textMuted, minWidth: '12px' }}
        />
        <span
          style={{
            fontSize: '10px',
            color: textMuted,
            minWidth: '60px',
            fontWeight: 600,
            letterSpacing: '0.4px',
          }}
        >
          ID
        </span>
        <span
          style={{
            fontSize: '10px',
            color: textMuted,
            flex: 1,
            fontWeight: 600,
            letterSpacing: '0.4px',
          }}
        >
          TITRE
        </span>
        <span
          style={{
            fontSize: '10px',
            color: textMuted,
            fontWeight: 600,
            letterSpacing: '0.4px',
          }}
        >
          MIS À JOUR
        </span>
      </div>

      {/* Liste groupée */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tickets.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              fontSize: '13px',
              color: textMuted,
              lineHeight: 1.55,
            }}
          >
            Aucun ticket disponible pour le moment.
          </div>
        ) : (
          <>
            <TicketGroup
              status="en-cours"
              tickets={grouped['en-cours']}
              dark={dark}
              showReferential={showReferential}
              onTicketClick={handleTicketClick}
            />
            <TicketGroup
              status="a-faire"
              tickets={grouped['a-faire']}
              dark={dark}
              showReferential={showReferential}
              onTicketClick={handleTicketClick}
            />
            <TicketGroup
              status="resolu"
              tickets={grouped['resolu']}
              dark={dark}
              showReferential={showReferential}
              onTicketClick={handleTicketClick}
            />
            <TicketGroup
              status="annule"
              tickets={grouped['annule']}
              dark={dark}
              showReferential={showReferential}
              onTicketClick={handleTicketClick}
            />
          </>
        )}
      </div>
    </div>
  );
}
