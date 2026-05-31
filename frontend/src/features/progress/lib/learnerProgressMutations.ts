import type { FormationProgressionBundle } from '../../arena/skills/data/formationBundleTypes';
import {
  computeNodeStatus,
  type LearnerProgress,
} from '../../arena/skills/data/progressionConfig';
import {
  getLearnerProgress,
  setLearnerProgress,
} from './learnerProgressStorage';

function normalizeIncidentId(incidentId: string): string {
  return incidentId.startsWith('INC-') ? incidentId : `INC-${incidentId}`;
}

function findNodeByIncidentId(
  bundle: FormationProgressionBundle,
  incidentId: string,
) {
  const fullId = normalizeIncidentId(incidentId);
  return bundle.nodes.find((node) => node.incidentId === fullId);
}

function readProgress(email: string, formationId: string): LearnerProgress[] {
  return getLearnerProgress(email, formationId) ?? [];
}

/** Marque un ticket comme démarré (nœud en cours). Retourne null si action impossible. */
export function markTicketStarted(
  email: string,
  formationId: string,
  incidentId: string,
  bundle: FormationProgressionBundle,
): LearnerProgress[] | null {
  const node = findNodeByIncidentId(bundle, incidentId);
  if (!node) return null;

  const progress = readProgress(email, formationId);
  const nodeStatus = computeNodeStatus(node.id, progress, bundle.edges);
  if (nodeStatus !== 'available' && nodeStatus !== 'in-progress') {
    return null;
  }
  const existing = progress.find((entry) => entry.nodeId === node.id);

  const nextEntry: LearnerProgress = {
    nodeId: node.id,
    status: 'in-progress',
    hintsUsed: existing?.hintsUsed ?? 0,
  };

  const nextProgress = existing
    ? progress.map((entry) =>
        entry.nodeId === node.id ? { ...entry, ...nextEntry } : entry,
      )
    : [...progress, nextEntry];

  setLearnerProgress(email, formationId, nextProgress);
  return nextProgress;
}

export interface ResolveTicketOptions {
  hintsUsed?: number;
  timeMinutes?: number;
}

/** Marque un ticket comme résolu. Retourne null si action impossible. */
export function markTicketResolved(
  email: string,
  formationId: string,
  incidentId: string,
  bundle: FormationProgressionBundle,
  options: ResolveTicketOptions = {},
): LearnerProgress[] | null {
  const node = findNodeByIncidentId(bundle, incidentId);
  if (!node) return null;

  const progress = readProgress(email, formationId);
  const nodeStatus = computeNodeStatus(node.id, progress, bundle.edges);
  if (nodeStatus === 'completed') return progress;
  if (nodeStatus !== 'in-progress' && nodeStatus !== 'available') {
    return null;
  }

  const existing = progress.find((entry) => entry.nodeId === node.id);

  const nextEntry: LearnerProgress = {
    nodeId: node.id,
    status: 'completed',
    completedAt: new Date().toISOString().slice(0, 10),
    hintsUsed: options.hintsUsed ?? existing?.hintsUsed ?? 0,
    timeMinutes: options.timeMinutes,
    xpEarned: node.xp,
  };

  const nextProgress = existing
    ? progress.map((entry) =>
        entry.nodeId === node.id ? nextEntry : entry,
      )
    : [...progress, nextEntry];

  setLearnerProgress(email, formationId, nextProgress);
  return nextProgress;
}
