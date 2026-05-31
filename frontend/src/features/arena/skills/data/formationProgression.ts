import type { FormationCcp, FormationProgressionBundle } from './formationBundleTypes';
import { DEDICATED_FORMATION_IDS } from '../../../formations/registry';
import { buildTssrFormationCcps, TSSR_PROGRESSION_BUNDLE } from './tssrProgression';
import type { LearnerProgress, SkillEdge, SkillNode } from './progressionConfig';
import { computeNodeStatus, SKILL_EDGES, SKILL_NODES } from './progressionConfig';

const GENERIC_FORMATION_ID = 'generic';

export function buildGenericFormationCcps(
  nodes: SkillNode[],
  edges: SkillEdge[],
  progress: LearnerProgress[],
): FormationCcp[] {
  return [
    {
      id: 'parcours',
      code: 'Parcours',
      title: 'Labs Linux, web, réseau et sécurité',
      description:
        'Parcours générique en attendant un référentiel officiel pour cette formation.',
      color: '#4d8fff',
      competences: nodes.map((n) => ({
        id: n.id,
        code: n.domain,
        label: n.title,
        validated: computeNodeStatus(n.id, progress, edges) === 'completed',
        ticketIds: n.incidentId ? [n.incidentId] : [],
      })),
    },
  ];
}

function buildGenericBundle(): FormationProgressionBundle {
  const tickets = SKILL_NODES.filter((n) => n.incidentId).map((n) => ({
    id: n.incidentId!,
    incidentId: n.incidentId!.replace(/^INC-/, ''),
    title: n.title,
    competenceCode: n.id,
    ccpCode: 'parcours',
    priority: 'moyenne' as const,
    status: 'a-faire' as const,
    updatedAt: '—',
  }));

  return {
    formationId: GENERIC_FORMATION_ID,
    nodes: SKILL_NODES,
    edges: SKILL_EDGES,
    tickets,
    ccps: buildGenericFormationCcps(SKILL_NODES, SKILL_EDGES, []),
    progress: [],
  };
}

const GENERIC_BUNDLE = buildGenericBundle();

const BY_FORMATION: Record<string, FormationProgressionBundle> = {
  tssr: TSSR_PROGRESSION_BUNDLE,
};

for (const formationId of DEDICATED_FORMATION_IDS) {
  if (!BY_FORMATION[formationId]) {
    throw new Error(`Missing progression bundle for formation: ${formationId}`);
  }
}

export function getFormationProgression(
  formationId?: string | null,
): FormationProgressionBundle {
  if (formationId && BY_FORMATION[formationId]) {
    return BY_FORMATION[formationId];
  }
  return GENERIC_BUNDLE;
}

export function deriveFormationCcps(
  base: FormationProgressionBundle,
  progress: LearnerProgress[],
): FormationCcp[] {
  if (base.formationId === 'tssr') {
    return buildTssrFormationCcps(base.nodes, progress, base.edges);
  }
  return buildGenericFormationCcps(base.nodes, base.edges, progress);
}
