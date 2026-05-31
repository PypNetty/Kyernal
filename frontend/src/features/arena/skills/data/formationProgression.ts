import type { FormationProgressionBundle } from './formationBundleTypes';
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
          validated: false,
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

/** Formations avec un bundle REAC / dédié prêt pour l’Arena. */
export const FORMATIONS_WITH_PROGRESSION = new Set(
  Object.keys(BY_FORMATION),
);

export function hasDedicatedProgression(formationId?: string | null): boolean {
  return Boolean(formationId && FORMATIONS_WITH_PROGRESSION.has(formationId));
}

export function getFormationProgression(
  formationId?: string | null,
): FormationProgressionBundle {
  if (formationId && BY_FORMATION[formationId]) {
    return BY_FORMATION[formationId];
  }
  return GENERIC_BUNDLE;
}
