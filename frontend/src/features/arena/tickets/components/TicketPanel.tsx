import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PanelProps, TicketData } from '../../layout/context/types';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import { resolveTicketByIncidentId } from '../data/ticketDetails';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  TicketPriority,
  TicketStatus,
} from '../data/ticketConfig';
import TicketPriorityIcon from './TicketPriorityIcon';
import TicketStatusIcon from './TicketStatusIcon';

interface TicketPanelProps extends PanelProps {
  incidentId: string;
  loading: boolean;
  sessionError?: string;
  vmReady: boolean;
}

function PropertyRow({
  label,
  children,
  dark,
}: {
  label: string;
  children: React.ReactNode;
  dark: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 0',
        fontSize: '13px',
      }}
    >
      <span style={{ color: dark ? '#71717a' : '#6b7280' }}>{label}</span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: dark ? '#e4e4e7' : '#111827',
          fontWeight: 500,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function getFormationTicketMeta(
  bundle: ReturnType<typeof useFormationBundle>,
  incidentId: string,
): {
  status: TicketStatus;
  priority: TicketPriority;
  competence: string;
} | null {
  const t = bundle.tickets.find(
    (x) => x.incidentId === incidentId || x.id === `INC-${incidentId}`,
  );
  if (!t) return null;
  return {
    status: t.status,
    priority: t.priority,
    competence: bundle.referential
      ? `${t.ccpCode} · ${t.competenceCode}`
      : t.competenceCode,
  };
}

export default function TicketPanel({
  dark,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver,
  incidentId,
  loading,
  sessionError,
  vmReady,
}: TicketPanelProps) {
  const navigate = useNavigate();
  const bundle = useFormationBundle();
  const ticket: TicketData | null = React.useMemo(
    () => resolveTicketByIncidentId(bundle, incidentId),
    [bundle, incidentId],
  );
  const meta = getFormationTicketMeta(bundle, incidentId);

  const bg = dark ? '#0f0f11' : '#ffffff';
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const surface = dark ? '#18181b' : '#f9fafb';

  if (!ticket) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: bg,
          color: muted,
          fontSize: '13px',
          gap: '12px',
          fontFamily: 'inherit',
        }}
      >
        <span>Issue INC-{incidentId} introuvable</span>
        <button
          type="button"
          onClick={() => navigate({ to: '/tickets' })}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: `1px solid ${border}`,
            background: 'transparent',
            color: text,
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          ← Retour aux issues
        </button>
      </div>
    );
  }

  const sessionLabel = loading
    ? 'Provisionnement…'
    : sessionError
      ? 'Erreur'
      : vmReady
        ? 'VM connectée'
        : 'Mode démo';

  const sessionColor = loading
    ? '#f2c94c'
    : sessionError
      ? '#eb5757'
      : vmReady
        ? '#30a46c'
        : '#8a8f98';

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'ticket')}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        outline: isDraggedOver ? `2px solid #5e6ad2` : 'none',
        outlineOffset: '-2px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
      }}
    >
      {/* Header draggable */}
      <div
        style={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
          gap: '8px',
        }}
      >
        <span
          draggable
          onDragStart={(e) => onDragStart(e, 'ticket')}
          style={{
            fontSize: '12px',
            color: muted,
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          ☰
        </span>
        <button
          type="button"
          onClick={() => navigate({ to: '/tickets' })}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '12px',
            color: muted,
            cursor: 'pointer',
          }}
        >
          Issues
        </button>
        <span style={{ color: muted, fontSize: '12px' }}>/</span>
        <span style={{ fontSize: '12px', color: muted, fontWeight: 500 }}>
          INC-{ticket.id}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {/* Titre */}
        <h2
          style={{
            margin: '0 0 16px',
            fontSize: '18px',
            fontWeight: 600,
            color: text,
            letterSpacing: '-0.02em',
            lineHeight: 1.35,
          }}
        >
          {ticket.title}
        </h2>

        {/* Bandeau session */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            marginBottom: '20px',
            borderRadius: '8px',
            background: surface,
            border: `1px solid ${border}`,
            fontSize: '13px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: sessionColor,
              flexShrink: 0,
            }}
          />
          <span style={{ color: text, fontWeight: 500 }}>{sessionLabel}</span>
          {!loading && !sessionError && !vmReady && (
            <span style={{ color: muted, fontSize: '12px' }}>
              — Terminal simulé (pas de Proxmox)
            </span>
          )}
        </div>

        {sessionError && (
          <div
            style={{
              padding: '10px 12px',
              marginBottom: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(235,87,87,0.3)',
              background: 'rgba(235,87,87,0.08)',
              color: '#eb5757',
              fontSize: '13px',
            }}
          >
            {sessionError}
          </div>
        )}

        {/* Propriétés */}
        {meta && (
          <div
            style={{
              padding: '12px 14px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: `1px solid ${border}`,
              background: surface,
            }}
          >
            <PropertyRow label="Statut" dark={dark}>
              <TicketStatusIcon status={meta.status} />
              {STATUS_CONFIG[meta.status].label}
            </PropertyRow>
            <PropertyRow label="Priorité" dark={dark}>
              <TicketPriorityIcon priority={meta.priority} />
              {PRIORITY_CONFIG[meta.priority].label}
            </PropertyRow>
            <PropertyRow label="Compétence" dark={dark}>
              {meta.competence}
            </PropertyRow>
            <PropertyRow label="Cible" dark={dark}>
              root@{ticket.server}
            </PropertyRow>
            <PropertyRow label="OS" dark={dark}>
              {ticket.os}
            </PropertyRow>
            <PropertyRow label="Sévérité" dark={dark}>
              {ticket.severity}
            </PropertyRow>
          </div>
        )}

        {/* Description */}
        <section style={{ marginBottom: '24px' }}>
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: '12px',
              fontWeight: 600,
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Description
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.65,
              color: dark ? '#d4d4d8' : '#374151',
            }}
          >
            {ticket.description}
          </p>
        </section>

        {/* Objectifs */}
        <section>
          <h3
            style={{
              margin: '0 0 10px',
              fontSize: '12px',
              fontWeight: 600,
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Objectifs
          </h3>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {ticket.objectives.map((obj, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '14px',
                  color: obj.done ? muted : text,
                  textDecoration: obj.done ? 'line-through' : 'none',
                }}
              >
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: `1.5px solid ${obj.done ? '#5e6ad2' : border}`,
                    background: obj.done ? '#5e6ad2' : 'transparent',
                    flexShrink: 0,
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#fff',
                  }}
                >
                  {obj.done ? '✓' : ''}
                </span>
                {obj.text}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
