import React from 'react';
import type { TicketObjective } from '../../skills/data/formationBundleTypes';
import type { TicketTheme } from '../ticketUi';

export default function TicketObjectivesList({
  objectives,
  theme,
}: {
  objectives: TicketObjective[];
  theme: TicketTheme;
}) {
  if (objectives.length === 0) return null;

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
        Objectifs
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
        {objectives.map((obj, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '13px',
              color: theme.textMuted,
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                color: theme.textMuted,
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              ○
            </span>
            {obj.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
