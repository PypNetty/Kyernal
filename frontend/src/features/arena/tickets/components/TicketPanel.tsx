import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { PanelProps, TicketData } from '../../layout/context/types';
import { getTicketStatusByRouteId } from '../../../progress';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';

const INBOX_TICKETS: TicketData[] = [
  {
    id: '042',
    title: 'Apache ne répond plus sur le port 80',
    description:
      'Le serveur web de la RH ne répond plus depuis ce matin. Le service semble planté.',
    reporter: 'Utilisateur RH',
    duration: '10 min',
    server: 'vm-web-rh',
    os: 'Debian 13',
    severity: 'Critique',
    objectives: [
      { text: 'Diagnostiquer la cause du blocage', done: false, active: true },
      { text: 'Identifier le processus sur le port 80', done: false, active: false },
      { text: 'Relancer le service proprement', done: false, active: false },
    ],
  },
  {
    id: '088',
    title: 'Problème DNS interne',
    description:
      'Impossible de résoudre les noms de domaine du lab. Les pings renvoient NXDOMAIN.',
    reporter: 'Formateur',
    duration: '1 heure',
    server: 'vm-dns-master',
    os: 'Debian 13',
    severity: 'Moyen',
    objectives: [{ text: "Vérifier l'état de bind9", done: false, active: true }],
  },
];

const mono = '"JetBrains Mono", "Fira Code", monospace';

interface TicketPanelProps extends PanelProps {
  incidentId?: string;
  onStartSession: (incidentId: string) => void;
  onResolveTicket: (incidentId: string) => Promise<boolean>;
  loading: boolean;
}

export default function TicketPanel({
  dark,
  vmHost,
  incidentId,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver,
  onStartSession,
  onResolveTicket,
  loading,
}: TicketPanelProps) {
  const navigate = useNavigate();
  const bundle = useFormationBundle();
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [resolving, setResolving] = useState(false);

  const routeTicket = incidentId
    ? bundle.tickets.find((ticket) => ticket.incidentId === incidentId)
    : undefined;
  const ticketStatus = incidentId
    ? getTicketStatusByRouteId(bundle, incidentId)
    : 'unknown';
  const isResolved = ticketStatus === 'resolu';
  const isLocked = ticketStatus === 'verrouille';
  const isUnknown = ticketStatus === 'unknown';

  const bg = dark ? '#000000' : '#f5f5f5';
  const headerBg = dark ? '#111111' : '#e5e5e5';
  const border = dark ? '#333333' : '#d4d4d4';
  const text = dark ? '#888888' : '#666666';
  const highlightText = dark ? '#eeeeee' : '#111111';
  const accent = dark ? '#00ff00' : '#0066ff';
  const critColor = dark ? '#ff3333' : '#cc0000';
  const warnColor = dark ? '#ffcc00' : '#aa8800';
  const okColor = dark ? '#33ff66' : '#30a46c';

  const getSeverityColor = (sev: string) => {
    if (sev === 'Critique') return critColor;
    if (sev === 'Moyen') return warnColor;
    return text;
  };

  const handleResolve = async () => {
    if (!incidentId || resolving || isResolved) return;
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

  const renderResolveAction = () => {
    if (isResolved) {
      return (
        <div style={{ marginTop: '20px', color: okColor, fontWeight: 'bold' }}>
          [ RESOLVED ] Ticket clos
          <div style={{ marginTop: '8px', fontWeight: 'normal' }}>
            <Link
              to="/tickets"
              style={{ color: accent, textDecoration: 'none', fontSize: '11px' }}
            >
              → retour /tickets
            </Link>
          </div>
        </div>
      );
    }

    if (isLocked) {
      return (
        <p style={{ marginTop: '20px', color: warnColor, fontSize: '11px' }}>
          [ LOCKED ] Ce ticket est dans le backlog — termine les tickets
          précédents pour le débloquer.
        </p>
      );
    }

    if (isUnknown) {
      return (
        <p style={{ marginTop: '20px', color: text, fontSize: '11px' }}>
          [ N/A ] Ce ticket n&apos;appartient pas à ton parcours actuel.
        </p>
      );
    }

    return (
      <button
        type="button"
        disabled={resolving}
        onClick={() => void handleResolve()}
        style={{
          marginTop: '20px',
          background: 'none',
          border: `1px solid ${accent}`,
          color: resolving ? text : accent,
          fontFamily: mono,
          fontSize: '11px',
          fontWeight: 'bold',
          padding: '4px 10px',
          cursor: resolving ? 'wait' : 'pointer',
        }}
      >
        {resolving ? '[ RESOLVING... ]' : '[ RESOLVE ] Marquer comme résolu'}
      </button>
    );
  };

  useEffect(() => {
    if (!incidentId) return;
    const mockTicket = INBOX_TICKETS.find((ticket) => ticket.id === incidentId);
    if (mockTicket) {
      setSelectedTicket(mockTicket);
    }
  }, [incidentId]);

  const renderRouteDetail = () => {
    if (!incidentId) return null;

    const title =
      routeTicket?.title ?? selectedTicket?.title ?? `INC-${incidentId}`;
    const description =
      selectedTicket?.description ??
      'Session de lab en cours — utilise le terminal pour diagnostiquer et corriger.';
    const displayId = selectedTicket?.id ?? incidentId;

    return (
      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, 'ticket')}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: bg,
          outline: isDraggedOver ? `1px solid ${accent}` : 'none',
          fontFamily: mono,
        }}
      >
        <div
          style={{
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            borderBottom: `1px solid ${border}`,
            background: headerBg,
          }}
        >
          <span
            draggable
            onDragStart={(e) => onDragStart(e, 'ticket')}
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: highlightText,
              cursor: 'grab',
              flex: 1,
            }}
          >
            [=] less /tickets/INC-{displayId}.log
          </span>
        </div>

        <div
          style={{
            padding: '12px',
            fontSize: '12px',
            color: text,
            overflowY: 'auto',
            lineHeight: '1.6',
          }}
        >
          <div style={{ color: highlightText, opacity: 0.5, marginBottom: '8px' }}>
            ==================================================
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: highlightText, fontWeight: 'bold' }}>
              INCIDENT #{displayId}
            </span>
            <span style={{ color: loading ? warnColor : vmHost ? accent : text }}>
              STATUS:{' '}
              {loading
                ? '[ PROVISIONING... ]'
                : vmHost
                  ? '[ CONNECTED ]'
                  : '[ WAITING ]'}
            </span>
          </div>
          <div style={{ color: highlightText, opacity: 0.5, marginBottom: '8px' }}>
            ==================================================
          </div>

          <div style={{ marginTop: '12px' }}>
            <span style={{ display: 'inline-block', width: '80px' }}>TITLE:</span>
            <span style={{ color: highlightText }}>{title}</span>
          </div>

          {routeTicket && (
            <div style={{ marginTop: '4px' }}>
              <span style={{ display: 'inline-block', width: '80px' }}>CP:</span>
              {routeTicket.ccpCode} · {routeTicket.competenceCode}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <span style={{ fontWeight: 'bold' }}>DESCRIPTION:</span>
            <br />
            <div
              style={{
                paddingLeft: '12px',
                borderLeft: `2px solid ${border}`,
                marginTop: '8px',
                color: highlightText,
              }}
            >
              {description}
            </div>
          </div>

          {selectedTicket?.objectives && (
            <div style={{ marginTop: '24px' }}>
              <span style={{ fontWeight: 'bold' }}>OBJECTIVES:</span>
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {selectedTicket.objectives.map((obj, i) => (
                  <div
                    key={i}
                    style={{
                      color: obj.done ? text : highlightText,
                      textDecoration: obj.done ? 'line-through' : 'none',
                    }}
                  >
                    {obj.done ? '[x]' : '[ ]'} {obj.text}
                    {obj.active && !obj.done && (
                      <span
                        style={{ color: accent, fontSize: '10px', marginLeft: '8px' }}
                      >
                        (ACTIVE)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderResolveAction()}
        </div>
      </div>
    );
  };

  if (incidentId && (routeTicket || selectedTicket)) {
    return renderRouteDetail();
  }

  if (!selectedTicket) {
    return (
      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, 'ticket')}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: bg,
          outline: isDraggedOver ? `1px solid ${accent}` : 'none',
          fontFamily: mono,
        }}
      >
        <div
          style={{
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            borderBottom: `1px solid ${border}`,
            background: headerBg,
          }}
        >
          <span
            draggable
            onDragStart={(e) => onDragStart(e, 'ticket')}
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: highlightText,
              cursor: 'grab',
            }}
          >
            [=] /var/spool/tickets/inbox
          </span>
        </div>

        <div
          style={{
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '11px',
              color: text,
              paddingBottom: '4px',
              borderBottom: `1px dashed ${border}`,
              marginBottom: '4px',
            }}
          >
            <span style={{ width: '40px' }}>ID</span>
            <span style={{ width: '50px' }}>SEV</span>
            <span style={{ flex: 1 }}>SUJET</span>
            <span style={{ width: '80px', textAlign: 'right' }}>CIBLE</span>
          </div>

          {INBOX_TICKETS.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => {
                setSelectedTicket(ticket);
                onStartSession(ticket.id);
              }}
              style={{
                display: 'flex',
                fontSize: '11px',
                color: text,
                padding: '4px 0',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = dark ? '#1a1a1a' : '#e0e0e0';
                e.currentTarget.style.color = highlightText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = text;
              }}
            >
              <span style={{ width: '40px' }}>{ticket.id}</span>
              <span
                style={{
                  width: '50px',
                  color: getSeverityColor(ticket.severity),
                }}
              >
                [{ticket.severity.substring(0, 4).toUpperCase()}]
              </span>
              <span
                style={{
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingRight: '8px',
                }}
              >
                {ticket.title}
              </span>
              <span style={{ width: '80px', textAlign: 'right' }}>{ticket.server}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'ticket')}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        outline: isDraggedOver ? `1px solid ${accent}` : 'none',
        fontFamily: mono,
      }}
    >
      <div
        style={{
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          borderBottom: `1px solid ${border}`,
          background: headerBg,
        }}
      >
        <span
          draggable
          onDragStart={(e) => onDragStart(e, 'ticket')}
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: highlightText,
            cursor: 'grab',
            flex: 1,
          }}
        >
          [=] less /tickets/INC-{selectedTicket.id}.log
        </span>
        <button
          onClick={() => setSelectedTicket(null)}
          style={{
            background: 'none',
            border: 'none',
            color: accent,
            cursor: 'pointer',
            fontSize: '11px',
            padding: 0,
          }}
        >
          [q] Quit
        </button>
      </div>

      <div
        style={{
          padding: '12px',
          fontSize: '12px',
          color: text,
          overflowY: 'auto',
          lineHeight: '1.6',
        }}
      >
        <div style={{ color: highlightText, opacity: 0.5, marginBottom: '8px' }}>
          ==================================================
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: highlightText, fontWeight: 'bold' }}>
            INCIDENT #{selectedTicket.id}
          </span>
          <span style={{ color: loading ? warnColor : accent, fontWeight: 'bold' }}>
            STATUS: {loading ? '[ PROVISIONING... ]' : '[ CONNECTED ]'}
          </span>
        </div>
        <div style={{ color: highlightText, opacity: 0.5, marginBottom: '8px' }}>
          ==================================================
        </div>

        <div style={{ marginTop: '12px' }}>
          <span style={{ display: 'inline-block', width: '80px' }}>TARGET:</span>
          <span style={{ color: highlightText }}>root@{selectedTicket.server}</span>
          <br />
          <span style={{ display: 'inline-block', width: '80px' }}>OS:</span>
          {selectedTicket.os}
          <br />
          <span style={{ display: 'inline-block', width: '80px' }}>REPORTER:</span>
          {selectedTicket.reporter}
        </div>

        <div style={{ marginTop: '20px' }}>
          <span style={{ fontWeight: 'bold' }}>DESCRIPTION:</span>
          <br />
          <div
            style={{
              paddingLeft: '12px',
              borderLeft: `2px solid ${border}`,
              marginTop: '8px',
              color: highlightText,
            }}
          >
            {selectedTicket.description}
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <span style={{ fontWeight: 'bold' }}>OBJECTIVES:</span>
          <br />
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {selectedTicket.objectives.map((obj, i) => (
              <div
                key={i}
                style={{
                  color: obj.done ? text : highlightText,
                  textDecoration: obj.done ? 'line-through' : 'none',
                }}
              >
                {obj.done ? '[x]' : '[ ]'} {obj.text}
                {obj.active && !obj.done && (
                  <span style={{ color: accent, fontSize: '10px', marginLeft: '8px' }}>
                    (ACTIVE)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {incidentId && renderResolveAction()}
      </div>
    </div>
  );
}
