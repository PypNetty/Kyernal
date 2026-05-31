import { Link } from '@tanstack/react-router';
import { useAuth } from '../../../auth';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import {
  AUTONOMY_SCORE,
  getLastSession,
  getProgressSnapshot,
  getRecommendedIncident,
  type LastSession,
  type RecommendedIncident,
} from '../data/homeData';
import styles from './Home.module.css';

const DOMAIN_SHORT: Record<string, string> = {
  linux: 'Linux',
  web: 'Apache',
  reseau: 'Réseau',
  securite: 'Sécurité',
  cloud: 'Cloud',
};

function formatEyebrowDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function CtaArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function FocalResumeCard({ session }: { session: LastSession }) {
  const hintLabel =
    session.hintsUsed === 1
      ? '1 indice utilisé'
      : `${session.hintsUsed} indices utilisés`;

  return (
    <section
      className={`${styles.focal} ${styles.reveal} ${styles.d4}`}
      style={{ ['--progress-pct' as string]: `${session.progressPercent}%` }}
    >
      <div className={styles.focalTop}>
        <span className={styles.tag}>
          <b>{session.incidentId}</b> · {DOMAIN_SHORT[session.domain] ?? session.domain}
        </span>
        {session.vmActive && (
          <span className={styles.vm}>
            <span className={styles.dot} />
            VM active
          </span>
        )}
      </div>
      <h2 className={styles.focalTitle}>{session.title}</h2>
      <div className={styles.focalMeta}>Dernière activité · {session.lastActive}</div>
      <div className={styles.bar}>
        <span className={styles.barFill} />
      </div>
      <div className={styles.focalFoot}>
        <span className={styles.pct}>
          {session.progressPercent}&nbsp;%&nbsp;·&nbsp;{hintLabel}
        </span>
        <Link
          to="/tickets/$incidentId"
          params={{ incidentId: session.ticketRouteId }}
          className={styles.cta}
        >
          Reprendre la session
          <CtaArrow />
        </Link>
      </div>
    </section>
  );
}

function FocalRecommendedCard({ incident }: { incident: RecommendedIncident }) {
  const locked = incident.status === 'locked';

  return (
    <section className={`${styles.focal} ${styles.reveal} ${styles.d4}`}>
      <div className={styles.focalTop}>
        <span className={styles.tag}>
          <b>{incident.incidentId}</b> · +{incident.node.xp} XP
        </span>
      </div>
      <h2 className={styles.focalTitle}>{incident.node.title}</h2>
      <div className={styles.focalMeta}>{incident.reason}</div>
      <div className={styles.focalFoot}>
        <span className={styles.pct}>{locked ? 'Prérequis manquants' : 'Prêt à démarrer'}</span>
        <Link
          to="/tickets/$incidentId"
          params={{ incidentId: incident.ticketRouteId }}
          className={styles.cta}
          style={locked ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
        >
          Lancer le lab
          <CtaArrow />
        </Link>
      </div>
    </section>
  );
}

export default function HomePanel() {
  const { data: session } = useAuth();
  const bundle = useFormationBundle();
  const lastSession = getLastSession(bundle);
  const recommended = getRecommendedIncident(bundle);
  const snapshot = getProgressSnapshot(bundle);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Apprenant';
  const xpPercent = Math.min(
    100,
    Math.round((snapshot.xpInLevel / snapshot.xpToNext) * 100),
  );

  const altRecommended =
    lastSession && recommended && recommended.ticketRouteId !== lastSession.ticketRouteId
      ? recommended
      : null;

  return (
    <main className={styles.main}>
      <p className={`${styles.eyebrow} ${styles.reveal} ${styles.d2}`}>
        {formatEyebrowDate(new Date())}
      </p>

      <h1 className={`${styles.greeting} ${styles.reveal} ${styles.d2}`}>
        Bon retour,
        <br />
        <em className={styles.greetingEm}>{firstName}.</em>
      </h1>
      <p className={`${styles.sub} ${styles.reveal} ${styles.d3}`}>
        {lastSession
          ? 'Une session t\u2019attend. Reprends là où tu t\u2019es arrêté.'
          : recommended
            ? 'Ton prochain lab est prêt. Lance une nouvelle session.'
            : 'Aucune session en cours pour le moment.'}
      </p>

      {lastSession ? (
        <FocalResumeCard session={lastSession} />
      ) : recommended ? (
        <FocalRecommendedCard incident={recommended} />
      ) : (
        <section className={`${styles.emptyFocal} ${styles.reveal} ${styles.d4}`}>
          Tous les labs sont complétés — explore tes compétences ou consulte ta boîte de
          réception.
        </section>
      )}

      {altRecommended && (
        <p className={`${styles.alt} ${styles.reveal} ${styles.d5}`}>
          Plutôt repartir à neuf ?{' '}
          <Link
            to="/tickets/$incidentId"
            params={{ incidentId: altRecommended.ticketRouteId }}
            className={styles.altLink}
          >
            Lance un nouveau lab — {altRecommended.node.title} (+{altRecommended.node.xp}&nbsp;XP)
          </Link>
        </p>
      )}

      <div className={`${styles.progressStrip} ${styles.reveal} ${styles.d6}`}>
        <span className={styles.lvl}>{snapshot.levelLabel}</span>
        <span className={styles.xpBar}>
          <span className={styles.xpBarFill} style={{ width: `${xpPercent}%` }} />
        </span>
        <span className={styles.xp}>
          {snapshot.xpInLevel} / {snapshot.xpToNext} XP
        </span>
        <span className={styles.auto}>
          Autonomie <b>{AUTONOMY_SCORE}</b>
        </span>
      </div>

      <nav className={`${styles.quietNav} ${styles.reveal} ${styles.d6}`}>
        <Link to="/competences" className={styles.quietLink}>
          Compétences
        </Link>
        <Link to="/inbox" className={styles.quietLink}>
          Boîte de réception
        </Link>
        <Link to="/statistiques" className={styles.quietLink}>
          Statistiques
        </Link>
        <Link to="/ressources" className={styles.quietLink}>
          Ressources
        </Link>
      </nav>
    </main>
  );
}
