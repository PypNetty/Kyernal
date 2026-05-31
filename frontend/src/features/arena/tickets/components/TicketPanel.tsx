import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { PanelProps, TicketData } from '../../layout/context/types';
import { getTicketStatusByRouteId } from '../../../progress';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';

// Mock de l'Inbox
const INBOX_TICKETS: TicketData[] = [
  {
    id: "042", title: "Apache ne répond plus sur le port 80",
    description: "Le serveur web de la RH ne répond plus depuis ce matin...",
    reporter: "Utilisateur RH", duration: "10 min", server: "vm-web-rh",
    os: "Debian 13", severity: "Critique",
    objectives: [
      { text: "Diagnostiquer la cause du blocage", done: false, active: true },
      { text: "Identifier le processus sur le port 80", done: false, active: false }
    ]
  },
  {
    id: "088", title: "Problème DNS interne",
    description: "Impossible de résoudre les noms de domaine du lab.",
    reporter: "Formateur", duration: "1 heure", server: "vm-dns-master",
    os: "Debian 13", severity: "Moyen",
    objectives: [
      { text: "Vérifier l'état de bind9", done: false, active: true }
    ]
  }
];

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
  const isUnknown = ticketStatus === 'unknown';

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const bg2 = dark ? '#111113' : '#ffffff';
  const text = dark ? '#ededed' : '#0f0f0f';
  const text2 = dark ? '#a1a1aa' : '#6b6b6b';

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
        <div
          style={{
            alignSelf: 'flex-start',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'rgba(48,164,108,0.12)',
            color: '#30a46c',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Ticket résolu
        </div>
      );
    }

    if (isUnknown) {
      return (
        <p style={{ fontSize: '12px', color: text2, margin: 0 }}>
          Ce ticket n&apos;appartient pas à ton parcours actuel.
        </p>
      );
    }

    return (
      <button
        type="button"
        disabled={resolving}
        onClick={() => void handleResolve()}
        style={{
          alignSelf: 'flex-start',
          padding: '6px 12px',
          borderRadius: '6px',
          border: 'none',
          background: resolving ? '#6b7280' : '#30a46c',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 600,
          cursor: resolving ? 'wait' : 'pointer',
        }}
      >
        {resolving ? 'Résolution…' : 'Marquer comme résolu'}
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

  if (incidentId && (routeTicket || selectedTicket)) {
    const title = routeTicket?.title ?? selectedTicket?.title ?? `INC-${incidentId}`;
    const description =
      selectedTicket?.description ??
      'Session de lab en cours — utilise le terminal pour diagnostiquer et corriger.';

    return (
      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, 'ticket')}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: bg2,
          outline: isDraggedOver ? '2px dashed #0066ff' : 'none',
        }}
      >
        <div
          style={{
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${border}`,
            background: bg,
          }}
        >
          <span
            draggable
            onDragStart={(e) => onDragStart(e, 'ticket')}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: text,
              cursor: 'grab',
            }}
          >
            ☰ Ticket #{incidentId}
          </span>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: 600 }}>
              #INC-{incidentId}
            </span>
            <h4 style={{ fontSize: '13px', margin: '4px 0', color: text }}>{title}</h4>
            <p style={{ fontSize: '11px', color: text2, margin: 0 }}>{description}</p>
          </div>
          <p style={{ fontSize: '12px', color: text }}>
            {loading ? 'Préparation de la VM...' : vmHost ? 'VM prête' : 'En attente de VM'}
          </p>
          {renderResolveAction()}
          {isResolved && (
            <Link
              to="/tickets"
              style={{ fontSize: '12px', color: '#0066ff', textDecoration: 'none' }}
            >
              Retour à mes tickets →
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!selectedTicket) {
    return (
      <div onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'ticket')} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bg2, outline: isDraggedOver ? '2px dashed #0066ff' : 'none' }}>
        <div style={{ height: '36px', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: `1px solid ${border}`, background: bg }}>
          <span draggable onDragStart={(e) => onDragStart(e, 'ticket')} style={{ fontSize: '12px', fontWeight: 600, color: text, cursor: 'grab' }}>☰ Inbox</span>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {INBOX_TICKETS.map(ticket => (
            <div key={ticket.id} onClick={() => { setSelectedTicket(ticket); onStartSession(ticket.id); }} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, cursor: 'pointer' }}>
              <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: 600 }}>#INC-{ticket.id}</span>
              <h4 style={{ fontSize: '13px', margin: '4px 0', color: text }}>{ticket.title}</h4>
              <p style={{ fontSize: '11px', color: text2, margin: 0 }}>{ticket.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'ticket')} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bg2, outline: isDraggedOver ? '2px dashed #0066ff' : 'none' }}>
       <div style={{ height: '36px', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: `1px solid ${border}`, background: bg }}>
        <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: '#0066ff', cursor: 'pointer', fontSize: '12px', padding: '0 8px 0 0' }}>← Retour</button>
        <span draggable onDragStart={(e) => onDragStart(e, 'ticket')} style={{ fontSize: '12px', fontWeight: 600, color: text, cursor: 'grab' }}>☰ Ticket #{selectedTicket.id}</span>
      </div>
      {/* ... (Ici tu peux remettre le reste de l'UI du ticket détaillé que j'avais fourni) ... */}
      <div style={{ padding: '16px' }}>
         <p style={{ fontSize: '12px', color: text }}>{loading ? 'Préparation de la VM...' : vmHost ? 'VM Prête !' : ''}</p>
         {incidentId && renderResolveAction()}
      </div>
    </div>
  );
}