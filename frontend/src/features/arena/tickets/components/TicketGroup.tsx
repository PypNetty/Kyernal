import React, { useState } from 'react';
import type { FormationTicket } from '../../skills/data/formationBundleTypes';
import {
  STATUS_CONFIG,
  ticketCompetenceLabel,
  type TicketStatus,
  type TicketTheme,
} from '../ticketUi';
import TicketRow from './TicketRow';

interface TicketGroupProps {
  status: TicketStatus;
  tickets: FormationTicket[];
  theme: TicketTheme;
  showReferential: boolean;
  selectedId: string | null;
  onTicketClick: (ticket: FormationTicket) => void;
}

export default function TicketGroup({
  status,
  tickets,
  theme,
  showReferential,
  selectedId,
  onTicketClick,
}: TicketGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const cfg = STATUS_CONFIG[status];

  if (tickets.length === 0) return null;

  return (
    <div style={{ marginBottom: '4px' }}>
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
          e.currentTarget.style.background = theme.hoverBg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.textMuted}
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

        <span
          style={{ color: cfg.color, display: 'flex', alignItems: 'center' }}
        >
          {cfg.icon}
        </span>

        <span
          style={{ fontSize: '12px', fontWeight: 600, color: theme.textMain }}
        >
          {cfg.label}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: theme.textMuted,
            background: theme.activeBg,
            padding: '1px 6px',
            borderRadius: '10px',
          }}
        >
          {tickets.length}
        </span>
      </div>

      {!collapsed &&
        tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            competence={ticketCompetenceLabel(ticket, showReferential)}
            theme={theme}
            selected={selectedId === ticket.incidentId}
            onClick={() => onTicketClick(ticket)}
          />
        ))}
    </div>
  );
}
