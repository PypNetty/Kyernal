import React from 'react';
import type { TicketTheme } from '../../tickets/ticketUi';
import type { Resource, ResourceType } from '../data/resourcesData';

const TYPE_LABELS: Record<ResourceType, { label: string; color: string }> = {
  doc: { label: 'Doc', color: '#4d8fff' },
  man: { label: 'Man', color: '#22d3ee' },
  cours: { label: 'Cours', color: '#a78bfa' },
  cheatsheet: { label: 'Cheatsheet', color: '#30a46c' },
  video: { label: 'Vidéo', color: '#f97316' },
};

export default function TicketResourcesList({
  resources,
  theme,
  onOpen,
}: {
  resources: Resource[];
  theme: TicketTheme;
  onOpen?: (resource: Resource) => void;
}) {
  if (resources.length === 0) return null;

  return (
    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: theme.textMain,
          marginBottom: '10px',
        }}
      >
        Ressources utiles
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {resources.map((resource) => {
          const typeCfg = TYPE_LABELS[resource.type];
          const isComingSoon = resource.type === 'cours' && !resource.url;
          const canOpen = Boolean(resource.url) && !isComingSoon;

          return (
            <li key={resource.id}>
              <button
                type="button"
                disabled={!canOpen}
                onClick={() => canOpen && onOpen?.(resource)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  background: 'transparent',
                  cursor: canOpen ? 'pointer' : 'default',
                  opacity: isComingSoon ? 0.55 : 1,
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: `${typeCfg.color}18`,
                    color: typeCfg.color,
                    fontWeight: 600,
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {typeCfg.label}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: theme.textMain,
                      lineHeight: 1.4,
                    }}
                  >
                    {resource.title}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: theme.textMuted,
                      lineHeight: 1.45,
                      marginTop: '2px',
                    }}
                  >
                    {isComingSoon ? 'Bientôt disponible' : resource.description}
                  </span>
                </span>
                {canOpen && (
                  <span
                    style={{
                      color: theme.textMuted,
                      flexShrink: 0,
                      fontSize: '12px',
                    }}
                  >
                    ↗
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
