import { Link } from '@tanstack/react-router';
import { useAuth } from '../../../auth';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import {
  computeAutonomyScore,
  getHomeLearnerState,
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

  const footMeta =
    session.progressPercent != null
      ? `${session.progressPercent}\u00a0%\u00a0·\u00a0${hintLabel}`
      : hintLabel;

  return (
    <section
      className={`${styles.focal} ${styles.reveal} ${styles.d4}`}
      style={
        session.progressPercent != null
          ? { ['--progress-pct' as string]: `${session.progressPercent}%` }
          : undefined
      }
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
      {session.lastActive && (
        <div className={styles.focalMeta}>Dernière activité · {session.lastActive}</div>
      )}
      {session.progressPercent != null && (
        <div className={styles.bar}>
          <span className={styles.barFill} />
        </div>
      )}
      <div className={styles.focalFoot}>
        <span className={styles.pct}>{footMeta}</span>
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
  const ctaLabel = incident.isFirstLab ? 'Voir mes tickets' : 'Voir le ticket';

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
        {incident.isFirstLab ? (
          <Link to="/tickets" className={styles.cta}>
            {ctaLabel}
            <CtaArrow />
          </Link>
        ) : (
          <Link
            to="/tickets/$incidentId"
            params={{ incidentId: incident.ticketRouteId }}
            className={styles.cta}
            style={locked ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          >
            {ctaLabel}
            <CtaArrow />
          </Link>
        )}
      </div>
    </section>
  );
}

function greetingHeading(firstName: string, isWelcome: boolean) {
  return (
    <>
      {isWelcome ? 'Bienvenue,' : 'Bon retour,'}
      <br />
      <em className={styles.greetingEm}>{firstName}.</em>
    </>
  );
}

function subtitleForState(
  state: ReturnType<typeof getHomeLearnerState>,
): string {
  switch (state) {
    case 'in-progress':
      return 'Une session t\u2019attend. Reprends là où tu t\u2019es arrêté.';
    case 'new':
      return 'Ton premier ticket t\u2019attend. Découvre comment Kyernal fonctionne.';
    case 'continue':
      return 'Ton prochain ticket est prêt.';
    case 'complete':
      return 'Tous tes labs sont complétés — explore tes compétences ou consulte ta boîte de réception.';
  }
}

export default function HomePanel() {
  const { data: session } = useAuth();
  const bundle = useFormationBundle();
  const lastSession = getLastSession(bundle);
  const recommended = getRecommendedIncident(bundle);
  const snapshot = getProgressSnapshot(bundle);
  const learnerState = getHomeLearnerState(lastSession, recommended);
  const autonomyScore = computeAutonomyScore(bundle.mockProgress);

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
        {greetingHeading(firstName, learnerState === 'new')}
      </h1>
      <p className={`${styles.sub} ${styles.reveal} ${styles.d3}`}>
        {subtitleForState(learnerState)}
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
        {autonomyScore != null && (
          <span className={styles.auto}>
            Autonomie <b>{autonomyScore}</b>
          </span>
        )}
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

      <p className={`${styles.workspaceLink} ${styles.reveal} ${styles.d6}`}>
        <Link to="/inbox" className={styles.workspaceLinkAnchor}>
          Ouvrir l&apos;espace de travail
          <CtaArrow />
        </Link>
      </p>
    </main>
  );
}
