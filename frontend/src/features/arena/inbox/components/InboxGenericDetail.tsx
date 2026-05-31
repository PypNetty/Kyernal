import React from 'react';
import { getInboxTheme } from '../inboxUi';
import type { InboxMessage } from '../data/inboxData';
import { renderInboxBody } from '../lib/renderInboxBody';
import InboxNotificationLayout, {
  InboxPrimaryLink,
} from './InboxNotificationLayout';
import styles from './Inbox.module.css';

const IconArchive = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

export default function InboxGenericDetail({
  message,
  dark,
  onArchive,
}: {
  message: InboxMessage;
  dark: boolean;
  onArchive: () => void;
}) {
  const theme = getInboxTheme(dark);

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
      type={message.type}
      excerpt={
        <div className={styles.prose}>
          {renderInboxBody(message.body, dark, theme.textMain, theme.textMuted)}
        </div>
      }
      chips={chips}
      toolbar={
        <button
          type="button"
          className={styles.archiveBtn}
          onClick={onArchive}
          title="Archiver ce message"
        >
          <IconArchive />
          Archiver
        </button>
      }
      actions={
        message.type === 'system' ? (
          <InboxPrimaryLink to="/tickets" label="Voir Mes tickets" />
        ) : undefined
      }
    />
  );
}
