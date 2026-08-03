import { PRIORITY_CONFIG, TicketPriority } from '../data/ticketConfig';

export default function TicketPriorityIcon({
  priority,
  size = 14,
}: {
  priority: TicketPriority;
  size?: number;
}) {
  const cfg = PRIORITY_CONFIG[priority];
  const barW = 2;
  const gap = 1.5;
  const heights = [10, 8, 6, 4];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-label={cfg.label}
      title={cfg.label}
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={2 + i * (barW + gap)}
          y={14 - h}
          width={barW}
          height={h}
          rx={0.5}
          fill={i < cfg.filled ? cfg.color : 'currentColor'}
          opacity={i < cfg.filled ? 1 : 0.25}
        />
      ))}
    </svg>
  );
}
