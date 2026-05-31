import React, { useState } from 'react';
import type { FormationTicket } from '../../skills/data/formationBundleTypes';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  type TicketTheme,
} from '../ticketUi';

interface TicketRowProps {
  ticket: FormationTicket;
  competence: string;
  theme: TicketTheme;
  selected: boolean;
  onClick: () => void;
}

export default function TicketRow({
  ticket,
  competence,
  theme,
  selected,
  onClick,
}: TicketRowProps) {
  const [hovered, setHovered] = useState(false);
  const statusCfg = STATUS_CONFIG[ticket.status];
  const priorityCfg = PRIORITY_CONFIG[ticket.priority];
  const isLocked = ticket.status === 'verrouille';

  const background = selected
    ? theme.activeBg
    : hovered
      ? theme.hoverBg
      : 'transparent';

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
        borderBottom: `1px solid ${theme.rowBorder}`,
        background,
        cursor: 'pointer',
        opacity: isLocked ? 0.55 : 1,
        transition: 'background 0.1s',
        position: 'relative',
      }}
    >
      {selected && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            background: '#0055e5',
          }}
        />
      )}

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

      <span
        style={{
          fontSize: '11px',
          color: theme.textMuted,
          fontWeight: 500,
          flexShrink: 0,
          minWidth: '60px',
        }}
      >
        {ticket.id}
      </span>

      <span
        style={{
          fontSize: '13px',
          color: theme.textMain,
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

      <span
        style={{
          fontSize: '11px',
          color: theme.textMuted,
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
