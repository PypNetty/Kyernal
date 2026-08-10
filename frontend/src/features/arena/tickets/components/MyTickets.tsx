import React, { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import {
  FILTER_TABS,
  STATUS_ORDER,
  TicketFilter,
  TicketPriority,
  TicketStatus,
} from '../data/ticketConfig';
import TicketPriorityIcon from './TicketPriorityIcon';
import TicketStatusIcon from './TicketStatusIcon';

interface Ticket {
  id: string;
  incidentId: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  label: string;
  updatedAt: string;
}

function TicketRow({
  ticket,
  dark,
  onClick,
}: {
  ticket: Ticket;
  dark: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const muted = dark ? '#6b7280' : '#9ca3af';
  const text = dark ? '#e5e7eb' : '#111827';
  const hoverBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const resolved = ticket.status === 'resolu' || ticket.status === 'annule';

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 20px',
        border: 'none',
        borderBottom: `1px solid ${dark ? '#1a1a1d' : '#f0f0f2'}`,
        background: hovered ? hoverBg : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        opacity: resolved ? 0.55 : 1,
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>
        <TicketStatusIcon status={ticket.status} />
      </span>

      <span
        style={{
          flexShrink: 0,
          fontSize: '13px',
          fontWeight: 500,
          color: muted,
          minWidth: '72px',
        }}
      >
        {ticket.id}
      </span>

      <span
        style={{
          flex: 1,
          fontSize: '13px',
          fontWeight: 500,
          color: text,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textDecoration: resolved ? 'line-through' : 'none',
        }}
      >
        {ticket.title}
      </span>

      <span
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: hovered ? 1 : 0.7,
        }}
      >
        <TicketPriorityIcon priority={ticket.priority} />
        <span
          style={{
            fontSize: '12px',
            color: muted,
            padding: '2px 8px',
            borderRadius: '4px',
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          }}
        >
          {ticket.label}
        </span>
        <span style={{ fontSize: '12px', color: muted, minWidth: '64px' }}>
          {ticket.updatedAt}
        </span>
      </span>
    </button>
  );
}

export default function MyTickets() {
  const { dark } = useContext(LayoutCtx);
  const navigate = useNavigate();
  const bundle = useFormationBundle();
  const [filter, setFilter] = useState<TicketFilter>('all');
  const [search, setSearch] = useState('');

  const tickets: Ticket[] = useMemo(
    () =>
      bundle.tickets.map((t) => ({
        id: t.id,
        incidentId: t.incidentId,
        title: t.title,
        status: t.status,
        priority: t.priority,
        label: bundle.referential
          ? `${t.competenceCode}`
          : t.competenceCode,
        updatedAt: t.updatedAt,
      })),
    [bundle],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q)
      );
    });
  }, [tickets, filter, search]);

  const grouped = useMemo(() => {
    if (filter !== 'all') return [{ status: filter, items: filtered }];
    return STATUS_ORDER.map((status) => ({
      status,
      items: filtered.filter((t) => t.status === status),
    })).filter((g) => g.items.length > 0);
  }, [filtered, filter]);

  const activeCount = tickets.filter(
    (t) => t.status === 'en-cours' || t.status === 'a-faire',
  ).length;

  const bg = dark ? '#0f0f11' : '#ffffff';
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const tabBg = dark ? '#18181b' : '#f4f4f5';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
      }}
    >
      {/* Header Linear-style */}
      <div
        style={{
          padding: '20px 20px 0',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 600,
              color: text,
              letterSpacing: '-0.01em',
            }}
          >
            Issues
          </h1>
          <span style={{ fontSize: '13px', color: muted }}>
            {activeCount} actifs
          </span>
        </div>

        {/* Filtres */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '12px',
            flexWrap: 'wrap',
          }}
        >
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.id;
            const count =
              tab.id === 'all'
                ? tickets.length
                : tickets.filter((t) => t.status === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: active ? tabBg : 'transparent',
                  color: active ? text : muted,
                  transition: 'background 0.1s',
                }}
              >
                {tab.label}
                <span style={{ marginLeft: '4px', opacity: 0.6 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recherche */}
        <div style={{ marginBottom: '12px' }}>
          <input
            type="search"
            placeholder="Rechercher un ticket…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '320px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: dark ? '#18181b' : '#fafafa',
              color: text,
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Liste */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '48px 20px',
              textAlign: 'center',
              color: muted,
              fontSize: '13px',
            }}
          >
            Aucun ticket trouvé
          </div>
        ) : (
          grouped.map(({ status, items }) => (
            <div key={status}>
              {filter === 'all' && (
                <div
                  style={{
                    padding: '8px 20px 4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: muted,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    position: 'sticky',
                    top: 0,
                    background: bg,
                    zIndex: 1,
                  }}
                >
                  {status === 'en-cours'
                    ? 'En cours'
                    : status === 'a-faire'
                      ? 'À faire'
                      : status === 'resolu'
                        ? 'Terminés'
                        : 'Annulés'}
                  <span style={{ marginLeft: '6px', fontWeight: 500 }}>
                    {items.length}
                  </span>
                </div>
              )}
              {items.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  dark={dark}
                  onClick={() =>
                    navigate({
                      to: '/tickets/$incidentId',
                      params: { incidentId: ticket.incidentId },
                    })
                  }
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
