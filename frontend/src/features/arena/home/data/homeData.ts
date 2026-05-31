import type { FormationProgressionBundle } from '../../skills/data/formationBundleTypes';
import {
  computeNodeStatus,
  getCurrentLevel,
  getTotalXp,
  type LearnerProgress,
  type NodeDomain,
} from '../../skills/data/progressionConfig';
import {
  countCompletedIncidentNodes,
  countTotalIncidentNodes,
  getInProgressNode,
  getLearnerPhase,
  getNextIncident,
  type LearnerPhase,
  type NextIncident,
} from '../../../progress';

export type { LearnerPhase, NextIncident };
export type HomeLearnerState = LearnerPhase;

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

/** @deprecated Use NextIncident */
export type RecommendedIncident = NextIncident;

export interface ProgressSnapshot {
  totalXp: number;
  levelLabel: string;
  levelColor: string;
  xpInLevel: number;
  xpToNext: number;
  completedTickets: number;
  totalTickets: number;
  inProgressLab: string | null;
  domainProgress: { domain: NodeDomain; done: number; total: number }[];
}

function incidentRouteId(incidentId: string): string {
  return incidentId.replace(/^INC-/, '');
}

export function getLastSession(
  bundle: FormationProgressionBundle,
): LastSession | null {
  const inProgress = bundle.progress.find((p) => p.status === 'in-progress');
  if (!inProgress) return null;

  const node = getInProgressNode(bundle);
  if (!node?.incidentId) return null;

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
): NextIncident | null {
  return getNextIncident(bundle);
}

export function getHomeLearnerState(
  bundle: FormationProgressionBundle,
): HomeLearnerState {
  return getLearnerPhase(bundle);
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
  const { nodes, edges, progress } = bundle;
  const totalXp = getTotalXp(progress);
  const level = getCurrentLevel(totalXp);
  const inProgressNode = getInProgressNode(bundle);

  const domains: NodeDomain[] = ['linux', 'web', 'reseau', 'securite', 'cloud'];
  const domainProgress = domains.map((domain) => {
    const domainNodes = nodes.filter((n) => n.domain === domain);
    const done = domainNodes.filter(
      (n) => computeNodeStatus(n.id, progress, edges) === 'completed',
    ).length;
    return { domain, done, total: domainNodes.length };
  });

  return {
    totalXp,
    levelLabel: level.level,
    levelColor: level.color,
    xpInLevel: totalXp - level.min,
    xpToNext: level.max - level.min + 1,
    completedTickets: countCompletedIncidentNodes(bundle),
    totalTickets: countTotalIncidentNodes(bundle),
    inProgressLab: inProgressNode?.title ?? null,
    domainProgress: domainProgress.filter((d) => d.total > 0),
  };
}
