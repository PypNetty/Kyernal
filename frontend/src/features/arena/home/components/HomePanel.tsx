import { Link } from '@tanstack/react-router';
import { useContext } from 'react';
import { useAuth } from '../../../auth';
import { LayoutCtx } from '../../layout/components/Layout';
import { SKILL_LEVEL_LABELS } from '../../skills/data/skillConfig';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import {
  AUTONOMY_SCORE,
  getLastSession,
  getProgressSnapshot,
  getRecommendedIncident,
  type LastSession,
  type RecommendedIncident,
} from '../data/homeData';

const DOMAIN_LABEL: Record<string, string> = {
  linux: 'Linux',
  web: 'Web',
  reseau: 'Réseau',
  securite: 'Sécurité',
  cloud: 'Cloud',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function StatCard({
  label,
  value,
  hint,
  dark,
}: {
  label: string;
  value: string;
  hint?: string;
  dark: boolean;
}) {
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const surface = dark ? '#18181b' : '#f9fafb';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';

  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: '8px',
        border: `1px solid ${border}`,
        background: surface,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: muted,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: text,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      {hint && (
        <div style={{ fontSize: '12px', color: muted, marginTop: '4px' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function SessionCard({
  session,
  dark,
}: {
  session: LastSession;
  dark: boolean;
}) {
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';

  return (
    <section
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${border}`,
        background: dark ? '#18181b' : '#f9fafb',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#5e6ad2',
          }}
        >
          {session.incidentId}
        </span>
        {session.vmActive && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#30a46c',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#30a46c',
              }}
            />
            VM active
          </span>
        )}
      </div>
      <h3
        style={{
          margin: '0 0 6px',
          fontSize: '15px',
          fontWeight: 600,
          color: text,
        }}
      >
        {session.title}
      </h3>
      <p style={{ margin: '0 0 14px', fontSize: '13px', color: muted }}>
        {DOMAIN_LABEL[session.domain] ?? session.domain} · {session.lastActive}{' '}
        · {session.progressPercent}% ·{' '}
        {session.hintsUsed === 1
          ? '1 indice'
          : `${session.hintsUsed} indices`}
      </p>
      <div
        style={{
          height: '4px',
          borderRadius: '2px',
          background: dark ? '#27272a' : '#e5e7eb',
          overflow: 'hidden',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${session.progressPercent}%`,
            background: '#5e6ad2',
            borderRadius: '2px',
          }}
        />
      </div>
      <Link
        to="/tickets/$incidentId"
        params={{ incidentId: session.ticketRouteId }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '32px',
          padding: '0 14px',
          borderRadius: '6px',
          background: '#5e6ad2',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Reprendre la session →
      </Link>
    </section>
  );
}

function RecommendedCard({
  incident,
  dark,
}: {
  incident: RecommendedIncident;
  dark: boolean;
}) {
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const locked = incident.status === 'locked';

  return (
    <section
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${border}`,
        background: dark ? '#18181b' : '#f9fafb',
        opacity: locked ? 0.7 : 1,
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#5e6ad2',
        }}
      >
        {incident.incidentId} · +{incident.node.xp} XP
      </span>
      <h3
        style={{
          margin: '8px 0 6px',
          fontSize: '15px',
          fontWeight: 600,
          color: text,
        }}
      >
        {incident.node.title}
      </h3>
      <p style={{ margin: '0 0 14px', fontSize: '13px', color: muted }}>
        {incident.reason}
      </p>
      <Link
        to="/tickets/$incidentId"
        params={{ incidentId: incident.ticketRouteId }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '32px',
          padding: '0 14px',
          borderRadius: '6px',
          background: locked ? 'transparent' : '#5e6ad2',
          color: locked ? muted : '#fff',
          border: locked ? `1px solid ${border}` : 'none',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
          pointerEvents: locked ? 'none' : 'auto',
        }}
      >
        {locked ? 'Prérequis manquants' : 'Lancer le lab →'}
      </Link>
    </section>
  );
}

const QUICK_LINKS = [
  { label: 'Issues', to: '/tickets' as const },
  { label: 'Inbox', to: '/inbox' as const },
  { label: 'Compétences', to: '/competences' as const },
  { label: 'Ressources', to: '/ressources' as const },
  { label: 'Statistiques', to: '/statistiques' as const },
];

export default function HomePanel() {
  const { dark } = useContext(LayoutCtx);
  const { data: session } = useAuth();
  const bundle = useFormationBundle();
  const lastSession = getLastSession(bundle);
  const recommended = getRecommendedIncident(bundle);
  const snapshot = getProgressSnapshot(bundle);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Apprenant';
  const levelLabel =
    SKILL_LEVEL_LABELS[snapshot.levelLabel] ?? snapshot.levelLabel;
  const xpPercent = Math.min(
    100,
    Math.round((snapshot.xpInLevel / snapshot.xpToNext) * 100),
  );

  const altRecommended =
    lastSession && recommended && recommended.ticketRouteId !== lastSession.ticketRouteId
      ? recommended
      : null;

  const bg = dark ? '#0f0f11' : '#ffffff';
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const tabBg = dark ? '#18181b' : '#f4f4f5';

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '28px 24px 48px' }}>
        <header style={{ marginBottom: '28px' }}>
          <p style={{ margin: '0 0 6px', fontSize: '12px', color: muted }}>
            {formatDate(new Date())}
          </p>
          <h1
            style={{
              margin: '0 0 6px',
              fontSize: '22px',
              fontWeight: 600,
              color: text,
              letterSpacing: '-0.02em',
            }}
          >
            Bon retour, {firstName}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: muted }}>
            {bundle.referential?.treeLabel ?? 'Parcours Kyernal Arena'}
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <StatCard
            label="Niveau"
            value={levelLabel}
            hint={`${snapshot.totalXp} XP · ${xpPercent}% vers le suivant`}
            dark={dark}
          />
          <StatCard
            label="Labs"
            value={`${snapshot.completedLabs}/${snapshot.totalLabs}`}
            hint={
              snapshot.inProgressLab
                ? `En cours : ${snapshot.inProgressLab}`
                : 'Aucun lab en cours'
            }
            dark={dark}
          />
          <StatCard
            label="Autonomie"
            value={`${AUTONOMY_SCORE}%`}
            hint="Score mock · session suivante"
            dark={dark}
          />
        </div>

        <section style={{ marginBottom: '24px' }}>
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {lastSession ? 'Session en cours' : 'Prochain lab'}
          </h2>
          {lastSession ? (
            <SessionCard session={lastSession} dark={dark} />
          ) : recommended ? (
            <RecommendedCard incident={recommended} dark={dark} />
          ) : (
            <div
              style={{
                padding: '24px',
                borderRadius: '8px',
                border: `1px dashed ${border}`,
                color: muted,
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              Tous les labs sont complétés. Consulte tes compétences ou ton inbox.
            </div>
          )}
        </section>

        {altRecommended && (
          <section style={{ marginBottom: '24px' }}>
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: muted,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Alternative
            </h2>
            <RecommendedCard incident={altRecommended} dark={dark} />
          </section>
        )}

        <section>
          <h2
            style={{
              margin: '0 0 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Accès rapide
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: tabBg,
                  color: text,
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  border: `1px solid ${border}`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
