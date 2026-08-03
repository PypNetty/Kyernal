import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  INBOX_FILTER_TABS,
  MESSAGE_TYPE_CONFIG,
  incidentIdToRouteId,
  tagColor,
  type InboxFilter,
} from '../data/inboxConfig';
import {
  MOCK_MESSAGES,
  type InboxMessage,
  type MessageType,
} from '../data/inboxData';

function renderBody(
  body: string,
  dark: boolean,
  textMain: string,
  textMuted: string,
) {
  return body.split('\n').map((line, i) => {
    if (line === '') {
      return <div key={i} style={{ height: '8px' }} />;
    }

    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} style={{ color: textMain, fontWeight: 600 }}>
          {part}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      ),
    );

    const withCode = parts.flatMap((part, j) => {
      if (typeof part !== 'string') return [part];
      return part.split(/`(.*?)`/g).map((p, k) =>
        k % 2 === 1 ? (
          <code
            key={`${j}-${k}`}
            style={{
              background: dark ? '#27272a' : '#f4f4f5',
              color: dark ? '#a1a1aa' : '#52525b',
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {p}
          </code>
        ) : (
          p
        ),
      );
    });

    const isBullet = line.startsWith('- ');
    return (
      <p
        key={i}
        style={{
          margin: 0,
          paddingLeft: isBullet ? '12px' : 0,
          lineHeight: 1.65,
          fontSize: '14px',
          color: textMuted,
        }}
      >
        {withCode}
      </p>
    );
  });
}

function MessageRow({
  msg,
  active,
  dark,
  onClick,
}: {
  msg: InboxMessage;
  active: boolean;
  dark: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const unread = msg.status === 'unread';
  const text = dark ? '#e5e7eb' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const hoverBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const activeBg = dark ? 'rgba(94,106,210,0.08)' : 'rgba(94,106,210,0.06)';
  const typeCfg = MESSAGE_TYPE_CONFIG[msg.type];

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'block',
        padding: '12px 16px',
        border: 'none',
        borderBottom: `1px solid ${dark ? '#1a1a1d' : '#f0f0f2'}`,
        background: active ? activeBg : hovered ? hoverBg : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        {unread && (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#5e6ad2',
              flexShrink: 0,
              marginTop: '6px',
            }}
          />
        )}
        {!unread && <span style={{ width: '6px', flexShrink: 0 }} />}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: unread ? 600 : 500,
                color: typeCfg.color,
              }}
            >
              {typeCfg.label}
            </span>
            <span style={{ fontSize: '12px', color: muted, flexShrink: 0 }}>
              {msg.timestamp}
            </span>
          </div>

          <div
            style={{
              fontSize: '13px',
              fontWeight: unread ? 600 : 500,
              color: text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '3px',
            }}
          >
            {msg.subject}
          </div>

          <div
            style={{
              fontSize: '12px',
              color: muted,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {msg.from} · {msg.preview}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function InboxPanel({ dark }: { dark: boolean }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('1');
  const [messages, setMessages] = useState<InboxMessage[]>(MOCK_MESSAGES);
  const [filter, setFilter] = useState<InboxFilter>('all');
  const [search, setSearch] = useState('');

  const bg = dark ? '#0f0f11' : '#ffffff';
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const surface = dark ? '#18181b' : '#f9fafb';
  const tabBg = dark ? '#18181b' : '#f4f4f5';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter !== 'all' && m.type !== filter) return false;
      if (!q) return true;
      return (
        m.subject.toLowerCase().includes(q) ||
        m.from.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, search]);

  const selectedMsg = messages.find((m) => m.id === selected) ?? null;
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const handleSelect = (id: string) => {
    setSelected(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m)),
    );
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    if (!selected || messages.some((m) => m.id === selected)) return;
    setSelected(filtered[0]?.id ?? '');
  }, [messages, selected, filtered]);

  const routeIncidentId = incidentIdToRouteId(selectedMsg?.incidentId);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
        background: bg,
      }}
    >
      {/* Liste */}
      <div
        style={{
          width: '340px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '20px 16px 12px', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 600,
                color: text,
              }}
            >
              Inbox
            </h1>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#5e6ad2',
                }}
              >
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            {INBOX_FILTER_TABS.map((tab) => {
              const active = filter === tab.id;
              const count =
                tab.id === 'all'
                  ? messages.length
                  : messages.filter((m) => m.type === tab.id).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: active ? tabBg : 'transparent',
                    color: active ? text : muted,
                  }}
                >
                  {tab.label}
                  <span style={{ marginLeft: '4px', opacity: 0.55 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <input
            type="search"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '32px',
              padding: '0 10px',
              borderRadius: '6px',
              border: `1px solid ${border}`,
              background: surface,
              color: text,
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '40px 16px',
                textAlign: 'center',
                fontSize: '13px',
                color: muted,
              }}
            >
              Aucun message
            </div>
          ) : (
            filtered.map((msg) => (
              <MessageRow
                key={msg.id}
                msg={msg}
                active={msg.id === selected}
                dark={dark}
                onClick={() => handleSelect(msg.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Détail */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {selectedMsg ? (
          <>
            <div
              style={{
                padding: '16px 24px',
                borderBottom: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                flexShrink: 0,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: muted,
                    marginBottom: '6px',
                  }}
                >
                  {MESSAGE_TYPE_CONFIG[selectedMsg.type as MessageType].label}{' '}
                  · {selectedMsg.from} · {selectedMsg.timestamp}
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '17px',
                    fontWeight: 600,
                    color: text,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.35,
                  }}
                >
                  {selectedMsg.subject}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {routeIncidentId && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: '/tickets/$incidentId',
                        params: { incidentId: routeIncidentId },
                      })
                    }
                    style={{
                      height: '32px',
                      padding: '0 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#5e6ad2',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Ouvrir l'issue →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMsg.id)}
                  title="Supprimer"
                  style={{
                    height: '32px',
                    padding: '0 10px',
                    borderRadius: '6px',
                    border: `1px solid ${border}`,
                    background: 'transparent',
                    color: muted,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>

            {selectedMsg.tags && selectedMsg.tags.length > 0 && (
              <div
                style={{
                  padding: '10px 24px',
                  borderBottom: `1px solid ${border}`,
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}
              >
                {selectedMsg.tags.map((tag) => {
                  const c = tagColor(tag);
                  return (
                    <span
                      key={tag}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        background: c.bg,
                        color: c.color,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px',
              }}
            >
              <div style={{ maxWidth: '640px' }}>
                {renderBody(selectedMsg.body, dark, text, muted)}
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: muted,
              fontSize: '13px',
            }}
          >
            Sélectionne un message
          </div>
        )}
      </div>
    </div>
  );
}
