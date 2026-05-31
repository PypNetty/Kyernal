import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PanelProps } from '../../layout/context/types';
import { getLearnerTickets, getTicketStatusByRouteId } from '../../../progress';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import { getTicketTheme } from '../ticketUi';
import TicketDetail, { type TicketResolveState } from './TicketDetail';

interface TicketPanelProps extends PanelProps {
  incidentId?: string;
  onStartSession: (incidentId: string) => void;
  onResolveTicket: (incidentId: string) => Promise<boolean>;
  loading: boolean;
}

function resolveStateFromStatus(
  status: ReturnType<typeof getTicketStatusByRouteId>,
): TicketResolveState {
  if (status === 'resolu') return 'resolved';
  if (status === 'verrouille') return 'locked';
  if (status === 'unknown') return 'unknown';
  return 'available';
}

export default function TicketPanel({
  dark,
  vmHost,
  incidentId,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver,
  onResolveTicket,
  loading,
}: TicketPanelProps) {
  const navigate = useNavigate();
  const bundle = useFormationBundle();
  const showReferential = Boolean(bundle.referential);
  const theme = getTicketTheme(dark);
  const [resolving, setResolving] = useState(false);

  const ticket = incidentId
    ? getLearnerTickets(bundle).find((t) => t.incidentId === incidentId)
    : undefined;

  const ticketStatus = incidentId
    ? getTicketStatusByRouteId(bundle, incidentId)
    : 'unknown';

  const handleResolve = async () => {
    if (!incidentId || resolving) return;
    setResolving(true);
    try {
      const ok = await onResolveTicket(incidentId);
      if (ok) {
        navigate({ to: '/tickets' });
      }
    } finally {
      setResolving(false);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'ticket')}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        outline: isDraggedOver ? '2px dashed #0066ff' : 'none',
        outlineOffset: '-2px',
      }}
    >
      <div
        style={{
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px',
          flexShrink: 0,
          borderBottom: `1px solid ${theme.border}`,
          background: theme.listHeaderBg,
        }}
      >
        <span
          draggable
          onDragStart={(e) => onDragStart(e, 'ticket')}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: theme.textMain,
            cursor: 'grab',
            userSelect: 'none',
            flex: 1,
          }}
        >
          ☰ Ticket
        </span>
        {incidentId && (
          <span style={{ fontSize: '11px', color: theme.textMuted }}>
            {ticket?.id ?? `INC-${incidentId}`}
          </span>
        )}
      </div>

      <TicketDetail
        ticket={ticket ?? null}
        dark={dark}
        showReferential={showReferential}
        mode="session"
        vmHost={vmHost}
        loading={loading}
        resolveState={resolveStateFromStatus(ticketStatus)}
        onResolve={handleResolve}
        resolving={resolving}
      />
    </div>
  );
}
