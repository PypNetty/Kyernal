import { getFormationProgression } from '../../skills/data/formationProgression';
import {
  computeNodeStatus,
  getCurrentLevel,
  getTotalXp,
  type NodeDomain,
  type NodeStatus,
  type SkillNode,
} from '../../skills/data/progressionConfig';

export const AUTONOMY_SCORE = 74;

export interface LastSession {
  incidentId: string;
  ticketRouteId: string;
  title: string;
  domain: NodeDomain;
  lastActive: string;
  hintsUsed: number;
  progressPercent: number;
  vmActive: boolean;
}

export interface RecommendedIncident {
  node: SkillNode;
  incidentId: string;
  ticketRouteId: string;
  reason: string;
  status: NodeStatus;
}

export interface ProgressSnapshot {
  totalXp: number;
  levelLabel: string;
  levelColor: string;
  xpInLevel: number;
  xpToNext: number;
  completedLabs: number;
  totalLabs: number;
  inProgressLab: string | null;
  domainProgress: { domain: NodeDomain; done: number; total: number }[];
}

function incidentRouteId(incidentId: string): string {
  return incidentId.replace(/^INC-/, '');
}

function findNodeById(nodeId: string, formationId?: string | null): SkillNode {
  const { nodes } = getFormationProgression(formationId);
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) throw new Error(`Unknown skill node: ${nodeId}`);
  return node;
}

export function getLastSession(formationId?: string | null): LastSession | null {
  const { mockProgress: progress } = getFormationProgression(formationId);
  const inProgress = progress.find((p) => p.status === 'in-progress');
  if (!inProgress) return null;

  const node = findNodeById(inProgress.nodeId, formationId);
  if (!node.incidentId) return null;

  return {
    incidentId: node.incidentId,
    ticketRouteId: incidentRouteId(node.incidentId),
    title: node.title,
    domain: node.domain,
    lastActive: "Aujourd'hui, 09:42",
    hintsUsed: inProgress.hintsUsed ?? 0,
    progressPercent: 62,
    vmActive: true,
  };
}

export function getRecommendedIncident(
  formationId?: string | null,
): RecommendedIncident | null {
  const { nodes, edges, mockProgress: progress } =
    getFormationProgression(formationId);
  const inProgressNodeId = progress.find(
    (p) => p.status === 'in-progress',
  )?.nodeId;

  const available = progress.filter((p) => p.status === 'available');
  if (available.length > 0) {
    const node = findNodeById(available[0].nodeId, formationId);
    if (!node.incidentId) return null;
    return {
      node,
      incidentId: node.incidentId,
      ticketRouteId: incidentRouteId(node.incidentId),
      reason: 'Branche parallèle · prérequis validés',
      status: 'available',
    };
  }

  if (inProgressNodeId) {
    const nextTargets = edges
      .filter((edge) => edge.source === inProgressNodeId)
      .map((edge) => edge.target);

    for (const targetId of nextTargets) {
      const status = computeNodeStatus(targetId, progress, edges);
      if (status === 'locked' || status === 'available') {
        const node = findNodeById(targetId, formationId);
        if (!node.incidentId) continue;
        const current = findNodeById(inProgressNodeId, formationId);
        return {
          node,
          incidentId: node.incidentId,
          ticketRouteId: incidentRouteId(node.incidentId),
          reason: `Prochaine étape après « ${current.title} »`,
          status,
        };
      }
    }
  }

  return null;
}

export function getProgressSnapshot(
  formationId?: string | null,
): ProgressSnapshot {
  const { nodes, edges, mockProgress: progress } =
    getFormationProgression(formationId);
  const totalXp = getTotalXp(progress);
  const level = getCurrentLevel(totalXp);
  const completedLabs = progress.filter((p) => p.status === 'completed').length;
  const inProgress = progress.find((p) => p.status === 'in-progress');
  const inProgressLab = inProgress
    ? findNodeById(inProgress.nodeId, formationId).title
    : null;

  const domains: NodeDomain[] = ['linux', 'web', 'reseau', 'securite', 'cloud'];
  const domainProgress = domains.map((domain) => {
    const domainNodes = nodes.filter((n) => n.domain === domain);
    const done = domainNodes.filter((n) => {
      const status = computeNodeStatus(n.id, progress, edges);
      return status === 'completed';
    }).length;
    return { domain, done, total: domainNodes.length };
  });

  return {
    totalXp,
    levelLabel: level.level,
    levelColor: level.color,
    xpInLevel: totalXp - level.min,
    xpToNext: level.max - level.min + 1,
    completedLabs,
    totalLabs: nodes.length,
    inProgressLab,
    domainProgress: domainProgress.filter((d) => d.total > 0),
  };
}

