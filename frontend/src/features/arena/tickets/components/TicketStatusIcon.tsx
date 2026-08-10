import { STATUS_CONFIG, TicketStatus } from '../data/ticketConfig';

export default function TicketStatusIcon({
  status,
  size = 14,
}: {
  status: TicketStatus;
  size?: number;
}) {
  const cfg = STATUS_CONFIG[status];
  const r = size / 2 - 1.5;

  if (status === 'resolu') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={cfg.dot}
          strokeWidth="1.5"
        />
        <path
          d={`M${size * 0.32} ${size * 0.52} L${size * 0.44} ${size * 0.64} L${size * 0.68} ${size * 0.38}`}
          fill="none"
          stroke={cfg.dot}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === 'en-cours') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={cfg.dot}
          strokeWidth="1.5"
        />
        <path
          d={`M${size / 2} ${size * 0.28} V${size / 2} L${size * 0.62} ${size * 0.58}`}
          fill="none"
          stroke={cfg.dot}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (status === 'annule') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={cfg.dot}
          strokeWidth="1.5"
        />
        <path
          d={`M${size * 0.36} ${size * 0.36} L${size * 0.64} ${size * 0.64} M${size * 0.64} ${size * 0.36} L${size * 0.36} ${size * 0.64}`}
          fill="none"
          stroke={cfg.dot}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={cfg.dot}
        strokeWidth="1.5"
      />
    </svg>
  );
}
