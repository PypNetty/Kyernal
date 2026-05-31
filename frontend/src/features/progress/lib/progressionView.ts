import type {
  FormationProgressionBundle,
  FormationTicket,
} from '../../arena/skills/data/formationBundleTypes';
import {
  computeNodeStatus,
  type LearnerProgress,
  type NodeStatus,
  type SkillNode,
} from '../../arena/skills/data/progressionConfig';

export type LearnerPhase = 'new' | 'in-progress' | 'continue' | 'complete';

export interface NextIncident {
  node: SkillNode;
  incidentId: string;
  ticketRouteId: string;
  reason: string;
  status: NodeStatus;
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

export function nodeStatusToTicketStatus(
  nodeStatus: NodeStatus,
): FormationTicket['status'] {
  switch (nodeStatus) {
    case 'in-progress':
      return 'en-cours';
    case 'completed':
      return 'resolu';
    default:
      return 'a-faire';
  }
}

function toNextIncident(
  node: SkillNode,
  reason: string,
  status: NodeStatus,
): NextIncident | null {
  if (!node.incidentId) return null;
  return {
    node,
    incidentId: node.incidentId,
    ticketRouteId: incidentRouteId(node.incidentId),
    reason,
    status,
  };
}

export function isNewLearner(progress: LearnerProgress[]): boolean {
  return (
    !progress.some((p) => p.status === 'in-progress') &&
    !progress.some((p) => p.status === 'completed')
  );
}

export function countCompletedIncidentNodes(
  bundle: FormationProgressionBundle,
): number {
  const { nodes, edges, progress } = bundle;
  return nodes.filter(
    (n) =>
      n.incidentId &&
      computeNodeStatus(n.id, progress, edges) === 'completed',
  ).length;
}

export function countTotalIncidentNodes(
  bundle: FormationProgressionBundle,
): number {
  return bundle.nodes.filter((n) => n.incidentId).length;
}

export function getTicketStatusByRouteId(
  bundle: FormationProgressionBundle,
  routeIncidentId: string,
): FormationTicket['status'] | 'unknown' {
  const fullId = routeIncidentId.startsWith('INC-')
    ? routeIncidentId
    : `INC-${routeIncidentId}`;
  const node = bundle.nodes.find((n) => n.incidentId === fullId);
  if (!node) return 'unknown';

  const nodeStatus = computeNodeStatus(node.id, bundle.progress, bundle.edges);
  if (nodeStatus === 'locked') return 'unknown';

  return nodeStatusToTicketStatus(nodeStatus);
}

export function getLearnerTickets(
  bundle: FormationProgressionBundle,
): FormationTicket[] {
  const { nodes, edges, progress, tickets } = bundle;

  return tickets.flatMap((ticket) => {
    const node = nodes.find((n) => n.incidentId === ticket.id);
    if (!node) return [];

    const nodeStatus = computeNodeStatus(node.id, progress, edges);
    if (nodeStatus === 'locked') return [];

    return [{ ...ticket, status: nodeStatusToTicketStatus(nodeStatus) }];
  });
}

function pickFirstAvailableIncident(
  bundle: FormationProgressionBundle,
): NextIncident | null {
  const { nodes, edges, progress } = bundle;
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
  const firstTicket = isNewLearner(progress);

  return toNextIncident(
    pick,
    firstTicket ? 'Premier ticket · prêt à démarrer' : 'Prêt à démarrer',
    'available',
  );
}

export function getNextIncident(
  bundle: FormationProgressionBundle,
): NextIncident | null {
  const { edges, progress } = bundle;
  const inProgressNodeId = progress.find(
    (p) => p.status === 'in-progress',
  )?.nodeId;

  if (inProgressNodeId) {
    const nextTargets = edges
      .filter((edge) => edge.source === inProgressNodeId)
      .map((edge) => edge.target);

    for (const targetId of nextTargets) {
      const status = computeNodeStatus(targetId, progress, edges);
      if (status === 'locked' || status === 'available') {
        const node = findNodeById(bundle, targetId);
        const current = findNodeById(bundle, inProgressNodeId);
        const incident = toNextIncident(
          node,
          `Prochaine étape après « ${current.title} »`,
          status,
        );
        if (incident) return incident;
      }
    }
  }

  return pickFirstAvailableIncident(bundle);
}

export function getLearnerPhase(
  bundle: FormationProgressionBundle,
): LearnerPhase {
  const hasInProgress = bundle.progress.some((p) => p.status === 'in-progress');
  if (hasInProgress) return 'in-progress';

  const next = getNextIncident(bundle);
  if (!next) return 'complete';
  if (isNewLearner(bundle.progress)) return 'new';
  return 'continue';
}

export function getInProgressNode(
  bundle: FormationProgressionBundle,
): SkillNode | null {
  const inProgress = bundle.progress.find((p) => p.status === 'in-progress');
  if (!inProgress) return null;
  return findNodeById(bundle, inProgress.nodeId);
}
