import type { FormationProgressionBundle } from './formationBundleTypes';
import { DEDICATED_FORMATION_IDS } from '../../../formations/registry';
import { TSSR_PROGRESSION_BUNDLE } from './tssrProgression';
import type { LearnerProgress, SkillEdge, SkillNode } from './progressionConfig';
import {
  MOCK_PROGRESS,
  SKILL_EDGES,
  SKILL_NODES,
} from './progressionConfig';

const GENERIC_FORMATION_ID = 'generic';

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
    ccps: [
      {
        id: 'parcours',
        code: 'Parcours',
        title: 'Labs Linux, web, réseau et sécurité',
        description:
          'Parcours générique en attendant un référentiel officiel pour cette formation.',
        color: '#4d8fff',
        competences: SKILL_NODES.map((n) => ({
          id: n.id,
          code: n.domain,
          label: n.title,
          validated:
            MOCK_PROGRESS.find((p) => p.nodeId === n.id)?.status === 'completed',
          ticketIds: n.incidentId ? [n.incidentId] : [],
        })),
      },
    ],
    mockProgress: MOCK_PROGRESS,
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
