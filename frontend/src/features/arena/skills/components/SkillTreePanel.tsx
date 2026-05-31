import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import {
  catalogSearch,
  docPageTitle,
  docsSearch,
  getResourcesForTicket,
  MOCK_RESOURCES,
} from '../../resources';
import { useFormationBundle } from '../hooks/useFormationBundle';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { LayoutCtx } from '../../layout/components/Layout';
import {
  DOMAIN_COLORS,
  XP_LEVELS,
  getCurrentLevel,
  getTotalXp,
  computeNodeStatus,
  NodeStatus,
  SkillNode,
  LearnerProgress,
  SkillEdge,
} from '../data/progressionConfig';

function nodeCompetenceLabel(node: SkillNode): string {
  return node.competenceCode ?? node.domain.toUpperCase();
}

// ── COULEURS STATUT ────────────────────────────────────────────────────────
const STATUS_STYLE: Record<
  NodeStatus,
  { border: string; bg: string; opacity: number }
> = {
  completed: { border: '#30a46c', bg: 'rgba(48,164,108,0.08)', opacity: 1 },
  'in-progress': { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', opacity: 1 },
  available: { border: '#4d8fff', bg: 'rgba(77,143,255,0.06)', opacity: 1 },
  locked: { border: '#27272a', bg: 'rgba(0,0,0,0)', opacity: 0.45 },
};

const STATUS_ICON: Record<NodeStatus, string> = {
  completed: '✓',
  'in-progress': '◐',
  available: '○',
  locked: '🔒',
};

// ── NŒUD CUSTOM ───────────────────────────────────────────────────────────
function SkillNodeComponent({ data }: NodeProps) {
  const { node, status, progress, domainColor, isFormateur } = data;
  const s = STATUS_STYLE[status];
  const prog = progress as LearnerProgress | undefined;

  return (
    <div
      style={{
        width: '180px',
        padding: '12px',
        borderRadius: '10px',
        border: `1.5px solid ${s.border}`,
        background: '#111113',
        boxShadow: status === 'completed' ? `0 0 12px ${s.border}22` : 'none',
        opacity: s.opacity,
        cursor: status === 'locked' ? 'not-allowed' : 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: s.border,
          width: '8px',
          height: '8px',
          border: 'none',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: s.border,
          width: '8px',
          height: '8px',
          border: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '4px',
            background: `${domainColor}18`,
            color: domainColor,
            letterSpacing: '0.5px',
          }}
        >
          {nodeCompetenceLabel(node)}
        </span>
        <span style={{ fontSize: '12px' }}>{STATUS_ICON[status]}</span>
      </div>

      {/* Titre */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#e4e4e7',
          marginBottom: '4px',
          lineHeight: 1.3,
        }}
      >
        {node.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '10px',
          color: '#71717a',
          lineHeight: 1.5,
          marginBottom: '8px',
        }}
      >
        {node.description}
      </div>

      {/* Footer : XP + infos si complété */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '10px', color: s.border, fontWeight: 600 }}>
          +{node.xp} XP
        </span>
        {status === 'completed' && prog && (
          <span style={{ fontSize: '10px', color: '#52525b' }}>
            {prog.timeMinutes}min ·{' '}
            {prog.hintsUsed === 0 ? '★ auto' : `${prog.hintsUsed} indices`}
          </span>
        )}
        {node.badge && status === 'completed' && (
          <span
            style={{
              fontSize: '9px',
              padding: '1px 5px',
              borderRadius: '3px',
              background: 'rgba(167,139,250,0.15)',
              color: '#a78bfa',
            }}
          >
            🏅 {node.badge}
          </span>
        )}
      </div>

      {/* Indicateur niveau */}
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          right: '10px',
          fontSize: '8px',
          fontWeight: 700,
          padding: '2px 5px',
          borderRadius: '3px',
          background: '#09090b',
          border: `1px solid ${s.border}`,
          color: s.border,
          letterSpacing: '0.3px',
        }}
      >
        {node.level.toUpperCase()}
      </div>
    </div>
  );
}

const nodeTypes = { skillNode: SkillNodeComponent };

// ── CONVERSION config → ReactFlow ─────────────────────────────────────────
function buildNodes(
  skillNodes: SkillNode[],
  skillEdges: SkillEdge[],
  progress: LearnerProgress[],
  isFormateur: boolean,
): Node[] {
  return skillNodes.map((n) => {
    const status = computeNodeStatus(n.id, progress, skillEdges);
    return {
      id: n.id,
      type: 'skillNode',
      position: n.position,
      draggable: isFormateur,
      data: {
        node: n,
        status,
        progress: progress.find((p) => p.nodeId === n.id),
        domainColor: DOMAIN_COLORS[n.domain],
        isFormateur,
      },
    };
  });
}

function buildEdges(
  skillEdges: SkillEdge[],
  progress: LearnerProgress[],
): Edge[] {
  return skillEdges.map((e) => {
    const sourceStatus = computeNodeStatus(e.source, progress, skillEdges);
    const isActive = sourceStatus === 'completed';
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label:
        e.branch === 'approfondissement'
          ? '↓ approfondir'
          : e.branch === 'nouveauté'
            ? '→ nouveau'
            : undefined,
      style: {
        stroke: isActive ? '#4d8fff' : '#27272a',
        strokeWidth: isActive ? 2 : 1,
        strokeDasharray: isActive ? undefined : '4 4',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isActive ? '#4d8fff' : '#27272a',
      },
      labelStyle: {
        fontSize: '10px',
        fill: '#52525b',
        fontFamily: 'monospace',
      },
      labelBgStyle: { fill: '#09090b', fillOpacity: 0.9 },
    };
  });
}

// ── PANEL STATS ────────────────────────────────────────────────────────────
function StatsPanel({
  progress,
  dark,
  totalNodes,
  skillNodes,
}: {
  progress: LearnerProgress[];
  dark: boolean;
  totalNodes: number;
  skillNodes: SkillNode[];
}) {
  const totalXp = getTotalXp(progress);
  const level = getCurrentLevel(totalXp);
  const nextLevel =
    XP_LEVELS[XP_LEVELS.findIndex((l) => l.level === level.level) + 1];
  const pct = nextLevel
    ? Math.round(((totalXp - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;
  const completed = progress.filter((p) => p.status === 'completed').length;
  const total = totalNodes;

  return (
    <div
      style={{
        background: '#111113',
        border: '1px solid #27272a',
        borderRadius: '8px',
        padding: '12px 14px',
        minWidth: '200px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#52525b',
          letterSpacing: '0.5px',
          marginBottom: '10px',
        }}
      >
        PROGRESSION
      </div>

      {/* Niveau */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 700, color: level.color }}>
          {totalXp} XP
        </span>
        <span
          style={{
            fontSize: '10px',
            padding: '2px 7px',
            borderRadius: '4px',
            background: `${level.color}18`,
            color: level.color,
            fontWeight: 600,
          }}
        >
          {level.level.toUpperCase()}
        </span>
      </div>

      {/* Barre XP */}
      <div
        style={{
          height: '4px',
          borderRadius: '2px',
          background: '#27272a',
          marginBottom: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '2px',
            background: level.color,
            width: `${pct}%`,
            transition: 'width 0.4s',
          }}
        />
      </div>

      {/* Tickets */}
      <div style={{ fontSize: '11px', color: '#71717a' }}>
        {completed}/{total} tickets résolus
      </div>

      {/* Badges */}
      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
        }}
      >
        {skillNodes
          .filter(
            (n) =>
              n.badge &&
              progress.find((p) => p.nodeId === n.id)?.status === 'completed',
          )
          .map((n) => (
          <span
            key={n.id}
            style={{
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '3px',
              background: 'rgba(167,139,250,0.15)',
              color: '#a78bfa',
            }}
          >
            🏅 {n.badge}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── COMPOSANT PRINCIPAL ───────────────────────────────────────────────────
export default function SkillTreePanel() {
  const { dark } = useContext(LayoutCtx);
  const bundle = useFormationBundle();
  const [isFormateur, setIsFormateur] = useState(false);
  const [progress, setProgress] = useState<LearnerProgress[]>(
    bundle.progress,
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    setProgress(bundle.progress);
    setSelectedNode(null);
  }, [bundle.formationId, bundle.progress]);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    buildNodes(bundle.nodes, bundle.edges, progress, isFormateur),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    buildEdges(bundle.edges, progress),
  );

  useEffect(() => {
    setNodes(buildNodes(bundle.nodes, bundle.edges, progress, isFormateur));
    setEdges(buildEdges(bundle.edges, progress));
  }, [bundle.nodes, bundle.edges, progress, isFormateur, setNodes, setEdges]);

  const handleRoleToggle = () => {
    setIsFormateur((prev) => !prev);
  };

  // Formateur — ajout de lien par drag
  const onConnect = useCallback(
    (params: Connection) => {
      if (!isFormateur) return;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: '#4d8fff', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#4d8fff' },
          },
          eds,
        ),
      );
    },
    [isFormateur, setEdges],
  );

  // Clic sur un nœud — apprenant peut lancer le ticket
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const status = node.data.status as NodeStatus;
    if (status === 'locked') return;
    setSelectedNode(node.id);
  }, []);

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const headerTextMuted = dark ? '#8a8a93' : '#6b6b6b';
  const bg = dark ? '#09090b' : '#fafaf9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: `1px solid ${border}`,
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: textMain,
            flex: 1,
          }}
        >
          Arbre de compétences
          {bundle.referential?.treeLabel && (
            <span
              style={{
                marginLeft: '8px',
                fontSize: '10px',
                fontWeight: 500,
                color: headerTextMuted,
              }}
            >
              · {bundle.referential.treeLabel}
            </span>
          )}
        </span>

        {/* Légende domaines */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
            <span
              key={domain}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                color: textMuted,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  background: color,
                  display: 'inline-block',
                }}
              />
              {domain}
            </span>
          ))}
        </div>

        {/* Toggle rôle */}
        <div
          style={{
            display: 'flex',
            background: dark ? '#141416' : '#f0f0ee',
            border: `1px solid ${border}`,
            borderRadius: '6px',
            padding: '3px',
            gap: '2px',
          }}
        >
          {(['Apprenant', 'Formateur'] as const).map((r) => (
            <button
              key={r}
              onClick={handleRoleToggle}
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                border: 'none',
                background:
                  (r === 'Formateur') === isFormateur
                    ? dark
                      ? '#27272a'
                      : '#ffffff'
                    : 'transparent',
                color:
                  (r === 'Formateur') === isFormateur ? textMain : textMuted,
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Info mode formateur */}
      {isFormateur && (
        <div
          style={{
            padding: '6px 16px',
            background: 'rgba(77,143,255,0.06)',
            borderBottom: `1px solid rgba(77,143,255,0.15)`,
            fontSize: '11px',
            color: '#4d8fff',
          }}
        >
          Mode formateur — glissez les nœuds pour les repositionner · Connectez
          deux nœuds pour créer un prérequis
        </div>
      )}

      {/* Canvas ReactFlow */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          key={bundle.formationId}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={isFormateur}
          nodesConnectable={isFormateur}
          elementsSelectable
          style={{ background: bg }}
        >
          <Background color={dark ? '#27272a' : '#e4e4e4'} gap={24} size={1} />
          <Controls
            style={{ background: '#111113', border: '1px solid #27272a' }}
          />
          <MiniMap
            nodeColor={(n) => {
              const status = n.data?.status as NodeStatus;
              return STATUS_STYLE[status]?.border ?? '#27272a';
            }}
            style={{ background: '#111113', border: '1px solid #27272a' }}
          />

          {/* Panel stats en haut à gauche */}
          <Panel position="top-left">
            <StatsPanel
              progress={progress}
              dark={dark}
              totalNodes={bundle.nodes.length}
              skillNodes={bundle.nodes}
            />
          </Panel>

          {/* Panel détail nœud sélectionné */}
          {selectedNode &&
            (() => {
              const node = bundle.nodes.find((n) => n.id === selectedNode);
              const prog = progress.find((p) => p.nodeId === selectedNode);
              const status = computeNodeStatus(
                selectedNode,
                progress,
                bundle.edges,
              );
              if (!node) return null;
              const color = DOMAIN_COLORS[node.domain];
              const linkedTicket = node.incidentId
                ? bundle.tickets.find((t) => t.incidentId === node.incidentId)
                : undefined;
              const ticketResources = linkedTicket
                ? getResourcesForTicket(linkedTicket, MOCK_RESOURCES)
                : [];
              const primaryResourceId = ticketResources[0]?.id;
              const docLabel = node.docsId
                ? docPageTitle(node.docsId)
                : null;
              return (
                <Panel position="top-right">
                  <div
                    style={{
                      background: '#111113',
                      border: `1px solid ${color}44`,
                      borderRadius: '8px',
                      padding: '14px',
                      minWidth: '220px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color,
                          letterSpacing: '0.5px',
                        }}
                      >
                        {nodeCompetenceLabel(node)}
                      </span>
                      <button
                        onClick={() => setSelectedNode(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#52525b',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#e4e4e7',
                        marginBottom: '6px',
                      }}
                    >
                      {node.title}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#71717a',
                        lineHeight: 1.6,
                        marginBottom: '10px',
                      }}
                    >
                      {node.description}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: `${color}18`,
                          color,
                        }}
                      >
                        +{node.xp} XP
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#27272a',
                          color: '#71717a',
                        }}
                      >
                        {node.level}
                      </span>
                      {node.badge && (
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(167,139,250,0.15)',
                            color: '#a78bfa',
                          }}
                        >
                          🏅 {node.badge}
                        </span>
                      )}
                    </div>
                    {(node.docsId || primaryResourceId) && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          marginBottom: '12px',
                        }}
                      >
                        {node.docsId && docLabel && (
                          <Link
                            to="/ressources"
                            search={docsSearch(node.docsId)}
                            style={{
                              fontSize: '11px',
                              fontWeight: 500,
                              color: '#4d8fff',
                              textDecoration: 'none',
                              lineHeight: 1.4,
                            }}
                          >
                            Fiche : {docLabel} →
                          </Link>
                        )}
                        {primaryResourceId && (
                          <Link
                            to="/ressources"
                            search={catalogSearch(primaryResourceId)}
                            style={{
                              fontSize: '11px',
                              fontWeight: 500,
                              color: '#4d8fff',
                              textDecoration: 'none',
                              lineHeight: 1.4,
                            }}
                          >
                            Ressources du lab
                            {ticketResources.length > 1
                              ? ` (${ticketResources.length})`
                              : ''}{' '}
                            →
                          </Link>
                        )}
                      </div>
                    )}
                    {status === 'available' && (
                      <button
                        style={{
                          width: '100%',
                          height: '32px',
                          borderRadius: '6px',
                          background: color,
                          color: '#09090b',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Lancer ce lab →
                      </button>
                    )}
                    {status === 'completed' && prog && (
                      <div style={{ fontSize: '11px', color: '#30a46c' }}>
                        ✓ Complété en {prog.timeMinutes}min
                        {prog.hintsUsed === 0
                          ? ' · Autonomie totale'
                          : ` · ${prog.hintsUsed} indice(s)`}
                      </div>
                    )}
                    {status === 'in-progress' && (
                      <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                        ◐ En cours…
                      </div>
                    )}
                  </div>
                </Panel>
              );
            })()}
        </ReactFlow>
      </div>
    </div>
  );
}
