import type { FormationCcp, FormationTicket } from './tssrProgression';
import { TSSR_PROGRESSION } from './tssrProgression';
import type {
  LearnerProgress,
  SkillEdge,
  SkillNode,
} from './progressionConfig';
import {
  MOCK_PROGRESS,
  SKILL_EDGES,
  SKILL_NODES,
} from './progressionConfig';

export interface FormationProgressionBundle {
  nodes: SkillNode[];
  edges: SkillEdge[];
  tickets: FormationTicket[];
  ccps: FormationCcp[];
  mockProgress: LearnerProgress[];
  isOfficialReferential: boolean;
}

const DEFAULT_TICKETS: FormationTicket[] = SKILL_NODES.filter(
  (n) => n.incidentId,
).map((n) => ({
  id: n.incidentId!,
  incidentId: n.incidentId!.replace(/^INC-/, ''),
  title: n.title,
  competenceCode: 'CP1' as const,
  ccpCode: 'CCP1' as const,
  priority: 'moyenne' as const,
  status: 'a-faire' as const,
  updatedAt: '—',
}));

const DEFAULT_CCPS: FormationCcp[] = [
  {
    id: 'ccp-demo',
    code: 'CCP1',
    title: 'Parcours générique',
    description: 'Progression Linux, web, réseau et sécurité (hors référentiel officiel).',
    color: '#4d8fff',
    competences: SKILL_NODES.map((n) => ({
      id: n.id,
      code: 'CP1' as const,
      label: n.title,
      validated: false,
      ticketIds: n.incidentId ? [n.incidentId] : [],
    })),
  },
];

const DEFAULT_BUNDLE: FormationProgressionBundle = {
  nodes: SKILL_NODES,
  edges: SKILL_EDGES,
  tickets: DEFAULT_TICKETS,
  ccps: DEFAULT_CCPS,
  mockProgress: MOCK_PROGRESS,
  isOfficialReferential: false,
};

const TSSR_BUNDLE: FormationProgressionBundle = {
  nodes: TSSR_PROGRESSION.nodes,
  edges: TSSR_PROGRESSION.edges,
  tickets: [...TSSR_PROGRESSION.tickets],
  ccps: TSSR_PROGRESSION.ccps,
  mockProgress: TSSR_PROGRESSION.mockProgress,
  isOfficialReferential: true,
};

const BY_FORMATION: Record<string, FormationProgressionBundle> = {
  tssr: TSSR_BUNDLE,
};

export function getFormationProgression(
  formationId?: string | null,
): FormationProgressionBundle {
  if (formationId && BY_FORMATION[formationId]) {
    return BY_FORMATION[formationId];
  }
  return DEFAULT_BUNDLE;
}
