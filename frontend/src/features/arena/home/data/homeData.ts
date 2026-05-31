import type { FormationProgressionBundle } from '../../skills/data/formationBundleTypes';
import {
  computeNodeStatus,
  getCurrentLevel,
  getTotalXp,
  type LearnerProgress,
  type NodeDomain,
  type NodeStatus,
  type SkillNode,
} from '../../skills/data/progressionConfig';

export type HomeLearnerState = 'new' | 'in-progress' | 'continue' | 'complete';

export interface LastSession {
  incidentId: string;
  ticketRouteId: string;
  title: string;
  domain: NodeDomain;
  hintsUsed: number;
  lastActive?: string;
  progressPercent?: number;
  vmActive?: boolean;
}

export interface RecommendedIncident {
  node: SkillNode;
  incidentId: string;
  ticketRouteId: string;
  reason: string;
  status: NodeStatus;
  isFirstLab?: boolean;
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

function findNodeById(
  bundle: FormationProgressionBundle,
  nodeId: string,
): SkillNode {
  const node = bundle.nodes.find((n) => n.id === nodeId);
  if (!node) throw new Error(`Unknown skill node: ${nodeId}`);
  return node;
}

function isNewLearner(progress: LearnerProgress[]): boolean {
  return (
    !progress.some((p) => p.status === 'in-progress') &&
    !progress.some((p) => p.status === 'completed')
  );
}

function toRecommendedIncident(
  bundle: FormationProgressionBundle,
  node: SkillNode,
  reason: string,
  status: NodeStatus,
  options?: { isFirstLab?: boolean },
): RecommendedIncident | null {
  if (!node.incidentId) return null;
  return {
    node,
    incidentId: node.incidentId,
    ticketRouteId: incidentRouteId(node.incidentId),
    reason,
    status,
    isFirstLab: options?.isFirstLab,
  };
}

function getFirstAvailableIncident(
  bundle: FormationProgressionBundle,
): RecommendedIncident | null {
  const { nodes, edges, mockProgress: progress } = bundle;
  const withIncident = nodes.filter((n) => n.incidentId);
  const available = withIncident.filter(
    (n) => computeNodeStatus(n.id, progress, edges) === 'available',
  );
  if (available.length === 0) return null;

  const entryIds = new Set(
    withIncident
      .filter((n) => !edges.some((e) => e.target === n.id))
      .map((n) => n.id),
  );
  const pick = available.find((n) => entryIds.has(n.id)) ?? available[0];
  const firstLab = isNewLearner(progress);

  return toRecommendedIncident(
    bundle,
    pick,
    firstLab ? 'Premier lab · prêt à démarrer' : 'Prêt à démarrer',
    'available',
    { isFirstLab: firstLab },
  );
}

export function getLastSession(
  bundle: FormationProgressionBundle,
): LastSession | null {
  const inProgress = bundle.mockProgress.find((p) => p.status === 'in-progress');
  if (!inProgress) return null;

  const node = findNodeById(bundle, inProgress.nodeId);
  if (!node.incidentId) return null;

  return {
    incidentId: node.incidentId,
    ticketRouteId: incidentRouteId(node.incidentId),
    title: node.title,
    domain: node.domain,
    hintsUsed: inProgress.hintsUsed ?? 0,
  };
}

export function getRecommendedIncident(
  bundle: FormationProgressionBundle,
): RecommendedIncident | null {
  const { edges, mockProgress: progress } = bundle;
  const inProgressNodeId = progress.find(
    (p) => p.status === 'in-progress',
  )?.nodeId;

  const available = progress.filter((p) => p.status === 'available');
  if (available.length > 0) {
    const node = findNodeById(bundle, available[0].nodeId);
    return toRecommendedIncident(
      bundle,
      node,
      'Branche parallèle · prérequis validés',
      'available',
    );
  }

  if (inProgressNodeId) {
    const nextTargets = edges
      .filter((edge) => edge.source === inProgressNodeId)
      .map((edge) => edge.target);

    for (const targetId of nextTargets) {
      const status = computeNodeStatus(targetId, progress, edges);
      if (status === 'locked' || status === 'available') {
        const node = findNodeById(bundle, targetId);
        const current = findNodeById(bundle, inProgressNodeId);
        const incident = toRecommendedIncident(
          bundle,
          node,
          `Prochaine étape après « ${current.title} »`,
          status,
        );
        if (incident) return incident;
      }
    }
  }

  return getFirstAvailableIncident(bundle);
}

export function getHomeLearnerState(
  lastSession: LastSession | null,
  recommended: RecommendedIncident | null,
): HomeLearnerState {
  if (lastSession) return 'in-progress';
  if (recommended?.isFirstLab) return 'new';
  if (recommended) return 'continue';
  return 'complete';
}

export function computeAutonomyScore(
  progress: LearnerProgress[],
): number | null {
  const completed = progress.filter((p) => p.status === 'completed');
  if (completed.length === 0) return null;

  const totalHints = completed.reduce((s, p) => s + (p.hintsUsed ?? 0), 0);
  const avgHints = totalHints / completed.length;
  return Math.round(Math.max(40, Math.min(100, 100 - avgHints * 12)));
}

export function getProgressSnapshot(
  bundle: FormationProgressionBundle,
): ProgressSnapshot {
  const { nodes, edges, mockProgress: progress } = bundle;
  const totalXp = getTotalXp(progress);
  const level = getCurrentLevel(totalXp);
  const completedLabs = progress.filter((p) => p.status === 'completed').length;
  const inProgress = progress.find((p) => p.status === 'in-progress');
  const inProgressLab = inProgress
    ? findNodeById(bundle, inProgress.nodeId).title
    : null;

  const labNodes = nodes.filter((n) => n.incidentId);
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
    totalLabs: labNodes.length,
    inProgressLab,
    domainProgress: domainProgress.filter((d) => d.total > 0),
  };
}
