import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import {
  INBOX_FILTERS,
  type InboxMessage,
  type MessageType,
} from '../data/inboxData';
import { buildInboxMessages } from '../lib/buildInboxMessages';
import { getInboxTheme, MESSAGE_TYPE_CONFIG } from '../inboxUi';
import InboxGenericDetail from './InboxGenericDetail';
import InboxIncidentDetail from './InboxIncidentDetail';
import styles from './Inbox.module.css';

function pickDefaultId(messages: InboxMessage[]): string {
  const unread = messages.find((m) => m.status === 'unread');
  return unread?.id ?? messages[0]?.id ?? '';
}

export default function InboxPanel({ dark }: { dark: boolean }) {
  const { startSession } = useContext(LayoutCtx);
  const bundle = useFormationBundle();
  const baseMessages = useMemo(() => buildInboxMessages(bundle), [bundle]);
  const theme = getInboxTheme(dark);

  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [archivedIds, setArchivedIds] = useState<Set<string>>(() => new Set());
  const [selected, setSelected] = useState<string>('');
  const [filter, setFilter] = useState<'all' | MessageType>('all');

  const cssVars = {
    '--inbox-bg': theme.bg,
    '--inbox-detail-bg': theme.bgDetail,
    '--inbox-border': theme.border,
    '--inbox-text': theme.textMain,
    '--inbox-muted': theme.textMuted,
    '--inbox-faint': theme.textFaint,
    '--inbox-hover': theme.hoverBg,
    '--inbox-active': theme.activeBg,
    '--inbox-accent': theme.accent,
    '--inbox-surface': theme.surface,
  } as React.CSSProperties;

  const messages = useMemo(() => {
    return baseMessages
      .filter((m) => !archivedIds.has(m.id))
      .map((m) => ({
        ...m,
        status: readIds.has(m.id) ? ('read' as const) : m.status,
      }));
  }, [baseMessages, archivedIds, readIds]);

  const filtered = messages.filter(
    (m) => filter === 'all' || m.type === filter,
  );
  const selectedMsg = messages.find((m) => m.id === selected) ?? null;
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  useEffect(() => {
    if (messages.length === 0) {
      setSelected('');
      return;
    }
    if (selected && messages.some((m) => m.id === selected)) return;
    setSelected(pickDefaultId(messages));
  }, [messages, selected]);

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const handleArchive = useCallback((id: string) => {
    setArchivedIds((prev) => new Set(prev).add(id));
  }, []);

  const handleStartLab = useCallback(
    (routeId: string) => {
      void startSession(routeId);
    },
    [startSession],
  );

  return (
    <div className={styles.panel} style={cssVars}>
      <aside className={styles.listPane}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>Boîte de réception</span>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>

        <div className={styles.filterRow}>
          {INBOX_FILTERS.map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              className={`${styles.filterChip} ${
                filter === val ? styles.filterChipActive : styles.filterChipIdle
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.listScroll}>
          {filtered.length === 0 && (
            <div className={styles.emptyList}>Aucun message</div>
          )}
          {filtered.map((msg) => {
            const isActive = msg.id === selected;
            const isUnread = msg.status === 'unread';
            const typeCfg = MESSAGE_TYPE_CONFIG[msg.type];
            return (
              <div
                key={msg.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(msg.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(msg.id);
                  }
                }}
                className={`${styles.row} ${isActive ? styles.rowActive : ''} ${
                  isUnread ? styles.rowUnread : ''
                }`}
                style={
                  isUnread
                    ? { borderLeftColor: typeCfg.accent }
                    : undefined
                }
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = theme.hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = '';
                }}
              >
                {isUnread && <span className={styles.unreadDot} />}
                <div className={styles.rowTop}>
                  <span
                    className={styles.typePill}
                    style={{
                      color: typeCfg.accent,
                      background: typeCfg.muted,
                    }}
                  >
                    {typeCfg.label}
                  </span>
                  <span className={styles.rowTime}>{msg.timestamp}</span>
                </div>
                <div
                  className={`${styles.rowSubject} ${
                    !isUnread ? styles.rowSubjectMuted : ''
                  }`}
                >
                  {msg.subject}
                </div>
                <div className={styles.rowPreview}>{msg.preview}</div>
              </div>
            );
          })}
        </div>
      </aside>

      {selectedMsg ? (
        selectedMsg.type === 'incident' ? (
          <InboxIncidentDetail
            message={selectedMsg}
            dark={dark}
            onStartLab={handleStartLab}
          />
        ) : (
          <InboxGenericDetail
            message={selectedMsg}
            dark={dark}
            onArchive={() => handleArchive(selectedMsg.id)}
          />
        )
      ) : (
        <div className={styles.detailPane}>
          <div className={styles.detailEmpty}>Sélectionne une notification</div>
        </div>
      )}
    </div>
  );
}
