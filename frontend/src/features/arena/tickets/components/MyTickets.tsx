import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LayoutCtx } from '../../layout/components/Layout';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import type { FormationTicket } from '../../skills/data/formationBundleTypes';
import { getLearnerTickets } from '../../../progress';
import { getTicketTheme, type TicketStatus } from '../ticketUi';
import TicketGroup from './TicketGroup';
import TicketDetail from './TicketDetail';

function pickDefaultTicket(tickets: FormationTicket[]): string | null {
  const preferred =
    tickets.find((t) => t.status === 'en-cours') ??
    tickets.find((t) => t.status === 'a-faire') ??
    tickets[0];
  return preferred?.incidentId ?? null;
}

export default function MyTickets() {
  const { dark } = useContext(LayoutCtx);
  const navigate = useNavigate();
  const bundle = useFormationBundle();
  const showReferential = Boolean(bundle.referential);
  const tickets = getLearnerTickets(bundle);
  const theme = getTicketTheme(dark);

  const [selectedId, setSelectedId] = useState<string | null>(() =>
    pickDefaultTicket(tickets),
  );

  const grouped = useMemo(
    (): Record<TicketStatus, FormationTicket[]> => ({
      'en-cours': tickets.filter((t) => t.status === 'en-cours'),
      'a-faire': tickets.filter((t) => t.status === 'a-faire'),
      verrouille: tickets.filter((t) => t.status === 'verrouille'),
      resolu: tickets.filter((t) => t.status === 'resolu'),
      annule: tickets.filter((t) => t.status === 'annule'),
    }),
    [tickets],
  );

  const selectedTicket =
    tickets.find((t) => t.incidentId === selectedId) ?? null;

  useEffect(() => {
    if (selectedId && tickets.some((t) => t.incidentId === selectedId)) return;
    setSelectedId(pickDefaultTicket(tickets));
  }, [tickets, selectedId]);

  const handleTicketClick = (ticket: FormationTicket) => {
    setSelectedId(ticket.incidentId);
  };

  const handleOpenLab = () => {
    if (!selectedTicket || selectedTicket.status === 'verrouille') return;
    navigate({
      to: '/tickets/$incidentId',
      params: { incidentId: selectedTicket.incidentId },
    });
  };

  const activeCount = tickets.filter(
    (t) =>
      t.status !== 'resolu' &&
      t.status !== 'annule' &&
      t.status !== 'verrouille',
  ).length;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        background: theme.bg,
      }}
    >
      <div
        style={{
          width: '320px',
          flexShrink: 0,
          borderRight: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column',
          background: theme.bg,
        }}
      >
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${theme.border}`,
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <span
            style={{ fontSize: '13px', fontWeight: 600, color: theme.textMain }}
          >
            Mes tickets
          </span>
          <span
            style={{
              fontSize: '11px',
              color: theme.textMuted,
              background: theme.activeBg,
              padding: '1px 7px',
              borderRadius: '10px',
            }}
          >
            {activeCount} actifs
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 16px 6px 32px',
            borderBottom: `1px solid ${theme.border}`,
            background: theme.listHeaderBg,
          }}
        >
          <span style={{ fontSize: '10px', color: theme.textMuted, minWidth: '12px' }} />
          <span style={{ fontSize: '10px', color: theme.textMuted, minWidth: '12px' }} />
          <span
            style={{
              fontSize: '10px',
              color: theme.textMuted,
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
              color: theme.textMuted,
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
              color: theme.textMuted,
              fontWeight: 600,
              letterSpacing: '0.4px',
            }}
          >
            MIS À JOUR
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {tickets.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                fontSize: '13px',
                color: theme.textMuted,
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
                theme={theme}
                showReferential={showReferential}
                selectedId={selectedId}
                onTicketClick={handleTicketClick}
              />
              <TicketGroup
                status="a-faire"
                tickets={grouped['a-faire']}
                theme={theme}
                showReferential={showReferential}
                selectedId={selectedId}
                onTicketClick={handleTicketClick}
              />
              <TicketGroup
                status="verrouille"
                tickets={grouped.verrouille}
                theme={theme}
                showReferential={showReferential}
                selectedId={selectedId}
                onTicketClick={handleTicketClick}
              />
              <TicketGroup
                status="resolu"
                tickets={grouped['resolu']}
                theme={theme}
                showReferential={showReferential}
                selectedId={selectedId}
                onTicketClick={handleTicketClick}
              />
              <TicketGroup
                status="annule"
                tickets={grouped['annule']}
                theme={theme}
                showReferential={showReferential}
                selectedId={selectedId}
                onTicketClick={handleTicketClick}
              />
            </>
          )}
        </div>
      </div>

      <TicketDetail
        ticket={selectedTicket}
        dark={dark}
        showReferential={showReferential}
        mode="browse"
        onOpenLab={handleOpenLab}
      />
    </div>
  );
}
