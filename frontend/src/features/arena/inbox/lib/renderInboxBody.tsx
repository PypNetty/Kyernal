import React from 'react';

export function renderInboxBody(
  body: string,
  dark: boolean,
  textMain: string,
  textMuted: string,
): React.ReactNode[] {
  return body.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} style={{ color: textMain, fontWeight: 600 }}>
          {part}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      ),
    );
    const finalParts = parts.map((part, j) =>
      typeof part === 'string'
        ? part.split(/`(.*?)`/g).map((p, k) =>
            k % 2 === 1 ? (
              <code
                key={k}
                style={{
                  background: dark ? '#1e2030' : '#f0f0f5',
                  color: dark ? '#7eb8ff' : '#0055e5',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              >
                {p}
              </code>
            ) : (
              p
            ),
          )
        : part,
    );
    return (
      <p
        key={i}
        style={{
          margin: line === '' ? '0 0 8px 0' : '0 0 4px 0',
          lineHeight: 1.7,
          fontSize: '13px',
          color: line.startsWith('**') ? textMain : textMuted,
        }}
      >
        {finalParts}
      </p>
    );
  });
}
