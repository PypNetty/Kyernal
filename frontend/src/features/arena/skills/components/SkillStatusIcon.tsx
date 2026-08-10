import { SKILL_STATUS_CONFIG } from '../data/skillConfig';
import type { NodeStatus } from '../data/progressionConfig';

export default function SkillStatusIcon({
  status,
  size = 14,
}: {
  status: NodeStatus;
  size?: number;
}) {
  const cfg = SKILL_STATUS_CONFIG[status];
  const r = size / 2 - 1.5;

  if (status === 'completed') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill={cfg.color}
          fillOpacity={0.15}
          stroke={cfg.color}
          strokeWidth="1.5"
        />
        <path
          d={`M${size * 0.32} ${size * 0.52} L${size * 0.44} ${size * 0.64} L${size * 0.68} ${size * 0.38}`}
          fill="none"
          stroke={cfg.color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === 'in-progress') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={cfg.color}
          strokeWidth="1.5"
        />
        <path
          d={`M${size / 2} ${size * 0.28} V${size / 2} L${size * 0.62} ${size * 0.58}`}
          fill="none"
          stroke={cfg.color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (status === 'locked') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={cfg.color}
          strokeWidth="1.5"
          strokeDasharray="3 2"
          opacity={0.6}
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
        stroke={cfg.color}
        strokeWidth="1.5"
      />
    </svg>
  );
}
