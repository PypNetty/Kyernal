import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LayoutCtx } from '../../layout/components/Layout';
import { useFormationBundle } from '../hooks/useFormationBundle';
import {
  SKILL_FILTER_TABS,
  SKILL_LEVEL_LABELS,
  SKILL_STATUS_CONFIG,
  type SkillFilter,
} from '../data/skillConfig';
import {
  DOMAIN_COLORS,
  XP_LEVELS,
  computeNodeStatus,
  getCurrentLevel,
  getTotalXp,
  type LearnerProgress,
  type NodeStatus,
  type SkillEdge,
  type SkillNode,
} from '../data/progressionConfig';
import SkillStatusIcon from './SkillStatusIcon';

function getPrerequisites(
  nodeId: string,
  edges: SkillEdge[],
  nodes: SkillNode[],
): SkillNode[] {
  return edges
    .filter((e) => e.target === nodeId)
    .map((e) => nodes.find((n) => n.id === e.source))
    .filter((n): n is SkillNode => Boolean(n));
}

interface SkillRow {
  node: SkillNode;
  status: NodeStatus;
  progress?: LearnerProgress;
}

function SkillListRow({
  row,
  active,
  dark,
  onClick,
}: {
  row: SkillRow;
  active: boolean;
  dark: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { node, status } = row;
  const text = dark ? '#e5e7eb' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const hoverBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const activeBg = dark ? 'rgba(94,106,210,0.08)' : 'rgba(94,106,210,0.06)';
  const domainColor = DOMAIN_COLORS[node.domain];
  const locked = status === 'locked';

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        border: 'none',
        borderBottom: `1px solid ${dark ? '#1a1a1d' : '#f0f0f2'}`,
        background: active ? activeBg : hovered ? hoverBg : 'transparent',
        cursor: locked ? 'default' : 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        opacity: locked ? 0.5 : 1,
      }}
    >
      <SkillStatusIcon status={status} />
      <span
        style={{
          flexShrink: 0,
          fontSize: '12px',
          fontWeight: 600,
          color: domainColor,
          minWidth: '36px',
        }}
      >
        {node.competenceCode ?? node.domain}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: '13px',
          fontWeight: 500,
          color: text,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {node.title}
      </span>
      <span style={{ fontSize: '12px', color: muted, flexShrink: 0 }}>
        +{node.xp} XP
      </span>
    </button>
  );
}

function ProgressHeader({
  progress,
  total,
  dark,
}: {
  progress: LearnerProgress[];
  total: number;
  dark: boolean;
}) {
  const totalXp = getTotalXp(progress);
  const level = getCurrentLevel(totalXp);
  const nextLevel =
    XP_LEVELS[XP_LEVELS.findIndex((l) => l.level === level.level) + 1];
  const pct = nextLevel
    ? Math.round(((totalXp - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;
  const completed = progress.filter((p) => p.status === 'completed').length;
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const border = dark ? '#1f1f23' : '#e8e8ec';

  return (
    <div
      style={{
        padding: '14px 16px',
        marginBottom: '4px',
        borderBottom: `1px solid ${border}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 700, color: level.color }}>
          {totalXp} XP
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '4px',
            background: `${level.color}18`,
            color: level.color,
          }}
        >
          {SKILL_LEVEL_LABELS[level.level] ?? level.level}
        </span>
      </div>
      <div
        style={{
          height: '4px',
          borderRadius: '2px',
          background: dark ? '#27272a' : '#e5e7eb',
          overflow: 'hidden',
          marginBottom: '6px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: level.color,
            borderRadius: '2px',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <span style={{ fontSize: '12px', color: muted }}>
        {completed}/{total} compétences validées
      </span>
    </div>
  );
}

export default function SkillTreePanel() {
  const { dark } = useContext(LayoutCtx);
  const navigate = useNavigate();
  const bundle = useFormationBundle();
  const [progress, setProgress] = useState<LearnerProgress[]>(
    bundle.mockProgress,
  );
  const [filter, setFilter] = useState<SkillFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setProgress(bundle.mockProgress);
    setSelectedId(null);
  }, [bundle.formationId, bundle.mockProgress]);

  const rows: SkillRow[] = useMemo(
    () =>
      bundle.nodes.map((node) => ({
        node,
        status: computeNodeStatus(node.id, progress, bundle.edges),
        progress: progress.find((p) => p.nodeId === node.id),
      })),
    [bundle.nodes, bundle.edges, progress],
  );

  useEffect(() => {
    if (selectedId && rows.some((r) => r.node.id === selectedId)) return;
    const pick =
      rows.find((r) => r.status === 'in-progress') ??
      rows.find((r) => r.status === 'available') ??
      rows[0];
    setSelectedId(pick?.node.id ?? null);
  }, [rows, selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.node.title.toLowerCase().includes(q) ||
        r.node.description.toLowerCase().includes(q) ||
        (r.node.competenceCode?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, filter, search]);

  const groups = useMemo(() => {
    if (bundle.ccps.length > 0 && bundle.referential) {
      return bundle.ccps
        .map((ccp) => ({
          label: ccp.code,
          subtitle: ccp.title,
          items: filtered.filter((r) => r.node.ccpCode === ccp.code),
        }))
        .filter((g) => g.items.length > 0);
    }
    return [{ label: 'Parcours', subtitle: '', items: filtered }];
  }, [bundle.ccps, bundle.referential, filtered]);

  const selected = rows.find((r) => r.node.id === selectedId) ?? null;

  const launchLab = useCallback(
    (node: SkillNode) => {
      const incidentId = node.incidentId?.replace(/^INC-/, '');
      if (!incidentId) return;
      navigate({ to: '/tickets/$incidentId', params: { incidentId } });
    },
    [navigate],
  );

  const bg = dark ? '#0f0f11' : '#ffffff';
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const surface = dark ? '#18181b' : '#f9fafb';
  const tabBg = dark ? '#18181b' : '#f4f4f5';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        background: bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
      }}
    >
      {/* Liste */}
      <div
        style={{
          width: '380px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '20px 16px 0', flexShrink: 0 }}>
          <div style={{ marginBottom: '4px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: 600,
                color: text,
              }}
            >
              Compétences
            </h1>
            {bundle.referential?.treeLabel && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '12px',
                  color: muted,
                }}
              >
                {bundle.referential.treeLabel}
              </p>
            )}
          </div>
        </div>

        <ProgressHeader
          progress={progress}
          total={bundle.nodes.length}
          dark={dark}
        />

        <div style={{ padding: '0 16px 10px', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            {SKILL_FILTER_TABS.map((tab) => {
              const active = filter === tab.id;
              const count =
                tab.id === 'all'
                  ? rows.length
                  : rows.filter((r) => r.status === tab.id).length;
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
              Aucune compétence
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                <div
                  style={{
                    padding: '8px 16px 4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: muted,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    position: 'sticky',
                    top: 0,
                    background: bg,
                    zIndex: 1,
                  }}
                >
                  {group.label}
                  {group.subtitle && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontWeight: 500,
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      · {group.subtitle}
                    </span>
                  )}
                </div>
                {group.items.map((row) => (
                  <SkillListRow
                    key={row.node.id}
                    row={row}
                    active={row.node.id === selectedId}
                    dark={dark}
                    onClick={() => setSelectedId(row.node.id)}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Détail */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {selected ? (
          <SkillDetail
            row={selected}
            progress={progress}
            edges={bundle.edges}
            nodes={bundle.nodes}
            dark={dark}
            onLaunch={launchLab}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: muted,
              fontSize: '13px',
            }}
          >
            Sélectionne une compétence
          </div>
        )}
      </div>
    </div>
  );
}

function SkillDetail({
  row,
  progress,
  edges,
  nodes,
  dark,
  onLaunch,
}: {
  row: SkillRow;
  progress: LearnerProgress[];
  edges: SkillEdge[];
  nodes: SkillNode[];
  dark: boolean;
  onLaunch: (node: SkillNode) => void;
}) {
  const { node, status, progress: prog } = row;
  const prereqs = getPrerequisites(node.id, edges, nodes);
  const domainColor = DOMAIN_COLORS[node.domain];
  const text = dark ? '#f4f4f5' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';
  const border = dark ? '#1f1f23' : '#e8e8ec';
  const surface = dark ? '#18181b' : '#f9fafb';
  const statusCfg = SKILL_STATUS_CONFIG[status];

  return (
    <div style={{ padding: '28px 32px', maxWidth: '640px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '4px',
            background: `${domainColor}18`,
            color: domainColor,
          }}
        >
          {node.competenceCode ?? node.domain.toUpperCase()}
        </span>
        {node.ccpCode && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: '4px',
              background: dark ? '#27272a' : '#f4f4f5',
              color: muted,
            }}
          >
            {node.ccpCode}
          </span>
        )}
      </div>

      <h2
        style={{
          margin: '0 0 8px',
          fontSize: '22px',
          fontWeight: 600,
          color: text,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}
      >
        {node.title}
      </h2>

      <p
        style={{
          margin: '0 0 24px',
          fontSize: '14px',
          lineHeight: 1.65,
          color: dark ? '#a1a1aa' : '#4b5563',
        }}
      >
        {node.description}
      </p>

      <div
        style={{
          padding: '14px 16px',
          borderRadius: '8px',
          border: `1px solid ${border}`,
          background: surface,
          marginBottom: '24px',
        }}
      >
        <Property label="Statut" dark={dark}>
          <SkillStatusIcon status={status} />
          {statusCfg.label}
        </Property>
        <Property label="Niveau" dark={dark}>
          {SKILL_LEVEL_LABELS[node.level] ?? node.level}
        </Property>
        <Property label="Récompense" dark={dark}>
          +{node.xp} XP
        </Property>
        <Property label="Domaine" dark={dark}>
          <span style={{ color: domainColor }}>{node.domain}</span>
        </Property>
        {node.incidentId && (
          <Property label="Issue liée" dark={dark}>
            {node.incidentId}
          </Property>
        )}
      </div>

      {prereqs.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h3
            style={{
              margin: '0 0 10px',
              fontSize: '12px',
              fontWeight: 600,
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Prérequis
          </h3>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {prereqs.map((p) => (
                <PrereqItem
                  key={p.id}
                  prereq={p}
                  progress={progress}
                  edges={edges}
                  dark={dark}
                />
              ))}
          </ul>
        </section>
      )}

      {node.badge && status === 'completed' && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.2)',
            color: '#a78bfa',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '20px',
          }}
        >
          Badge débloqué · {node.badge}
        </div>
      )}

      {(status === 'available' || status === 'in-progress') && node.incidentId && (
        <button
          type="button"
          onClick={() => onLaunch(node)}
          style={{
            height: '36px',
            padding: '0 16px',
            borderRadius: '6px',
            border: status === 'in-progress' ? '1px solid #f2c94c' : 'none',
            background: status === 'in-progress' ? 'transparent' : '#5e6ad2',
            color: status === 'in-progress' ? '#f2c94c' : '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {status === 'in-progress' ? 'Reprendre le lab →' : 'Lancer le lab →'}
        </button>
      )}

      {status === 'completed' && prog && (
        <div style={{ fontSize: '13px', color: '#30a46c', fontWeight: 500 }}>
          Validé en {prog.timeMinutes} min
          {prog.hintsUsed === 0
            ? ' · Autonomie totale'
            : ` · ${prog.hintsUsed} indice(s)`}
        </div>
      )}

      {status === 'locked' && (
        <p style={{ margin: 0, fontSize: '13px', color: muted }}>
          Termine les prérequis pour débloquer cette compétence.
        </p>
      )}
    </div>
  );
}

function Property({
  label,
  children,
  dark,
}: {
  label: string;
  children: React.ReactNode;
  dark: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 0',
        fontSize: '13px',
      }}
    >
      <span style={{ color: dark ? '#71717a' : '#6b7280' }}>{label}</span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: dark ? '#e4e4e7' : '#111827',
          fontWeight: 500,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function PrereqItem({
  prereq,
  progress,
  edges,
  dark,
}: {
  prereq: SkillNode;
  progress: LearnerProgress[];
  edges: SkillEdge[];
  dark: boolean;
}) {
  const pStatus = computeNodeStatus(prereq.id, progress, edges);
  const done = pStatus === 'completed';
  const text = dark ? '#e5e7eb' : '#111827';
  const muted = dark ? '#71717a' : '#6b7280';

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: done ? muted : text,
        textDecoration: done ? 'line-through' : 'none',
      }}
    >
      <SkillStatusIcon status={pStatus} size={12} />
      <span style={{ fontWeight: 500 }}>
        {prereq.competenceCode ?? prereq.domain}
      </span>
      <span style={{ color: muted }}>{prereq.title}</span>
    </li>
  );
}
