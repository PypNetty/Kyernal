import type { LearnerProgress, SkillEdge, SkillNode } from './progressionConfig';

export interface FormationReferentialMeta {
  badge: string;
  treeLabel?: string;
  transversalLabels?: readonly string[];
}

export interface FormationTicket {
  id: string;
  incidentId: string;
  title: string;
  competenceCode: string;
  ccpCode: string;
  priority: 'urgent' | 'haute' | 'moyenne' | 'basse';
  status: 'en-cours' | 'a-faire' | 'resolu' | 'annule';
  updatedAt: string;
}

export interface FormationCompetenceItem {
  id: string;
  code: string;
  label: string;
  validated: boolean;
  ticketIds: string[];
}

export interface FormationCcp {
  id: string;
  code: string;
  title: string;
  description: string;
  color: string;
  competences: FormationCompetenceItem[];
}

export interface FormationProgressionBundle {
  formationId: string;
  nodes: SkillNode[];
  edges: SkillEdge[];
  tickets: FormationTicket[];
  ccps: FormationCcp[];
  mockProgress: LearnerProgress[];
  referential?: FormationReferentialMeta;
}
