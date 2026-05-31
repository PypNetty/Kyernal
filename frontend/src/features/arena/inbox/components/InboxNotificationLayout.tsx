import React from 'react';
import { Link } from '@tanstack/react-router';
import { MESSAGE_TYPE_CONFIG } from '../inboxUi';
import type { InboxMessage, MessageType } from '../data/inboxData';
import styles from './Inbox.module.css';

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
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function InboxNotificationLayout({
  message,
  type,
  excerpt,
  chips,
  actions,
  footer,
  toolbar,
}: {
  message: InboxMessage;
  type: MessageType;
  excerpt: React.ReactNode | string;
  chips?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: string;
  toolbar?: React.ReactNode;
}) {
  const cfg = MESSAGE_TYPE_CONFIG[type];

  return (
    <div className={styles.detailPane}>
      <div className={styles.detailScroll}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          {toolbar && <div className={styles.detailToolbar}>{toolbar}</div>}
          <article className={styles.notificationCard}>
            <div
              className={styles.cardBanner}
              style={{ background: cfg.muted }}
            >
              <span
                className={styles.cardType}
                style={{ color: cfg.accent }}
              >
                {cfg.label}
              </span>
              <span className={styles.cardMeta}>{message.timestamp}</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardFrom}>
                {message.from}
                {message.incidentId ? ` · ${message.incidentId}` : ''}
              </div>
              <h2 className={styles.cardTitle}>{message.subject}</h2>
              {typeof excerpt === 'string' ? (
                <p className={styles.cardExcerpt}>{excerpt}</p>
              ) : (
                <div className={styles.cardExcerpt}>{excerpt}</div>
              )}
              {chips}
            </div>

            {actions && <div className={styles.cardActions}>{actions}</div>}

            {footer && <div className={styles.cardFooter}>{footer}</div>}
          </article>
        </div>
      </div>
    </div>
  );
}

export function InboxPrimaryLink({
  to,
  params,
  label,
  disabled,
}: {
  to: string;
  params?: Record<string, string>;
  label: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        className={styles.primaryAction}
        style={{ opacity: 0.45, pointerEvents: 'none' }}
      >
        {label}
        <CtaArrow />
      </span>
    );
  }

  return (
    <Link
      to={to}
      params={params}
      className={styles.primaryAction}
    >
      {label}
      <CtaArrow />
    </Link>
  );
}
