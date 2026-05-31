import React from 'react';
import { Link } from '@tanstack/react-router';
import { getInboxTheme } from '../inboxUi';
import type { InboxMessage } from '../data/inboxData';
import InboxNotificationLayout, {
  InboxPrimaryLink,
} from './InboxNotificationLayout';
import styles from './Inbox.module.css';

export default function InboxIncidentDetail({
  message,
  dark,
  onStartLab,
}: {
  message: InboxMessage;
  dark: boolean;
  onStartLab?: (routeId: string) => void;
}) {
  const theme = getInboxTheme(dark);
  const routeId = message.ticketRouteId;
  const isEnCours = message.ticketStatus === 'en-cours';

  const chips = message.tags && message.tags.length > 0 && (
    <div className={styles.chipRow}>
      {message.tags.map((tag) => (
        <span key={tag} className={styles.chip}>
          {tag}
        </span>
      ))}
    </div>
  );

  return (
    <InboxNotificationLayout
      message={message}
      type="incident"
      excerpt={message.body}
      chips={chips}
      footer="Le contexte détaillé, les objectifs et le terminal sont dans Mes tickets — pas ici."
      actions={
        <>
          {routeId && (
            <InboxPrimaryLink
              to="/tickets/$incidentId"
              params={{ incidentId: routeId }}
              label={isEnCours ? 'Reprendre le ticket' : 'Voir le ticket'}
            />
          )}
          {routeId && onStartLab && (
            <button
              type="button"
              className={styles.secondaryAction}
              onClick={() => onStartLab(routeId)}
            >
              {isEnCours ? 'Relancer le lab' : 'Démarrer le lab'}
            </button>
          )}
          <Link
            to="/tickets"
            style={{
              fontSize: '12px',
              color: theme.textMuted,
              textDecoration: 'none',
              padding: '4px 0',
            }}
          >
            Tous mes tickets
          </Link>
        </>
      }
    />
  );
}
