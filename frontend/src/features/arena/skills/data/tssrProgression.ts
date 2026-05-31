import {
  TSSR_CCPS,
  TSSR_COMPETENCES_TRANSVERSALES,
  TSSR_REFERENTIAL_META,
  getTssrCompetenceByNumber,
} from '../../../formations/data/tssrReferential';
import type {
  FormationCcp,
  FormationProgressionBundle,
  FormationTicket,
} from './formationBundleTypes';
import type {
  LearnerProgress,
  SkillEdge,
  SkillNode,
} from './progressionConfig';

const CCP_COLORS: Record<'CCP1' | 'CCP2', string> = {
  CCP1: '#0055e5',
  CCP2: '#30a46c',
};

/** Arbre de progression aligné sur les 9 CP du REAC TSSR 2023 */
export const TSSR_SKILL_NODES: SkillNode[] = [
  {
    id: 'tssr-cp1',
    incidentId: 'INC-150',
    title: 'Support utilisateur',
    description:
      'Prise en charge ITIL, dossier d’incident, escalade et base de connaissances.',
    domain: 'linux',
    level: 'novice',
    xp: 80,
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    position: { x: 60, y: 220 },
  },
  {
    id: 'tssr-cp2',
    incidentId: 'INC-151',
    title: 'Windows & Active Directory',
    description:
      'Comptes, droits, annuaire AD, diagnostic d’authentification.',
    domain: 'linux',
    level: 'junior',
    xp: 100,
    competenceCode: 'CP2',
    ccpCode: 'CCP1',
    position: { x: 280, y: 80 },
  },
  {
    id: 'tssr-cp3',
    incidentId: 'INC-021',
    title: 'Serveurs Linux',
    description: 'Exploitation, journaux, comptes et dépannage des services.',
    domain: 'linux',
    level: 'junior',
    xp: 100,
    competenceCode: 'CP3',
    ccpCode: 'CCP1',
    docsId: 'systemd',
    position: { x: 280, y: 220 },
  },
  {
    id: 'tssr-cp4',
    incidentId: 'INC-088',
    title: 'Réseau IP',
    description: 'Supervision, diagnostic par couches, VLAN et Wi-Fi sécurisé.',
    domain: 'reseau',
    level: 'junior',
    xp: 100,
    competenceCode: 'CP4',
    ccpCode: 'CCP1',
    docsId: 'dns',
    position: { x: 280, y: 380 },
  },
  {
    id: 'tssr-cp5',
    incidentId: 'INC-152',
    title: 'Infrastructure virtualisée',
    description: 'Hyperviseur, VM, messagerie cloud et supervision des ressources.',
    domain: 'cloud',
    level: 'confirmé',
    xp: 130,
    competenceCode: 'CP5',
    ccpCode: 'CCP2',
    position: { x: 520, y: 120 },
  },
  {
    id: 'tssr-cp6',
    incidentId: 'INC-115',
    title: 'Scripts d’automatisation',
    description: 'Bash / PowerShell, planification, tests et documentation.',
    domain: 'linux',
    level: 'confirmé',
    xp: 120,
    competenceCode: 'CP6',
    ccpCode: 'CCP2',
    position: { x: 520, y: 280 },
  },
  {
    id: 'tssr-cp7',
    incidentId: 'INC-095',
    title: 'Accès Internet & interconnexions',
    description: 'Pare-feu, VPN, proxy, PKI et accès nomades.',
    domain: 'securite',
    level: 'confirmé',
    xp: 130,
    competenceCode: 'CP7',
    ccpCode: 'CCP2',
    position: { x: 520, y: 440 },
  },
  {
    id: 'tssr-cp8',
    incidentId: 'INC-153',
    title: 'Sauvegardes & restaurations',
    description: 'Stratégie PRA/PCA, tests de restauration, espaces de stockage.',
    domain: 'securite',
    level: 'confirmé',
    xp: 140,
    competenceCode: 'CP8',
    ccpCode: 'CCP2',
    position: { x: 760, y: 280 },
  },
  {
    id: 'tssr-cp9',
    incidentId: 'INC-154',
    title: 'Déploiement des postes',
    description: 'Images, WSUS, mises à jour et bureau virtuel (VDI).',
    domain: 'linux',
    level: 'expert',
    xp: 150,
    competenceCode: 'CP9',
    ccpCode: 'CCP2',
    position: { x: 760, y: 440 },
  },
];

export const TSSR_SKILL_EDGES: SkillEdge[] = [
  { id: 't1', source: 'tssr-cp1', target: 'tssr-cp2', branch: 'nouveauté' },
  { id: 't2', source: 'tssr-cp1', target: 'tssr-cp3', branch: 'nouveauté' },
  { id: 't3', source: 'tssr-cp1', target: 'tssr-cp4', branch: 'nouveauté' },
  { id: 't4', source: 'tssr-cp3', target: 'tssr-cp5', branch: 'approfondissement' },
  { id: 't5', source: 'tssr-cp4', target: 'tssr-cp5', branch: 'approfondissement' },
  { id: 't6', source: 'tssr-cp2', target: 'tssr-cp5', branch: 'approfondissement' },
  { id: 't7', source: 'tssr-cp5', target: 'tssr-cp6', branch: 'nouveauté' },
  { id: 't8', source: 'tssr-cp5', target: 'tssr-cp7', branch: 'nouveauté' },
  { id: 't9', source: 'tssr-cp6', target: 'tssr-cp8', branch: 'approfondissement' },
  { id: 't10', source: 'tssr-cp7', target: 'tssr-cp8', branch: 'approfondissement' },
  { id: 't11', source: 'tssr-cp8', target: 'tssr-cp9', branch: 'nouveauté' },
];

export const TSSR_TICKETS: FormationTicket[] = [
  {
    id: 'INC-150',
    incidentId: '150',
    title: 'Ticket helpdesk — accès messagerie impossible',
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    priority: 'haute',
    status: 'a-faire',
    updatedAt: "Aujourd'hui",
  },
  {
    id: 'INC-151',
    incidentId: '151',
    title: 'Échec d’authentification domaine Active Directory',
    competenceCode: 'CP2',
    ccpCode: 'CCP1',
    priority: 'urgent',
    status: 'a-faire',
    updatedAt: "Aujourd'hui",
  },
  {
    id: 'INC-021',
    incidentId: '021',
    title: 'Service systemd en échec sur serveur Linux',
    competenceCode: 'CP3',
    ccpCode: 'CCP1',
    priority: 'haute',
    status: 'en-cours',
    updatedAt: 'Il y a 1h',
  },
  {
    id: 'INC-088',
    incidentId: '088',
    title: 'Panne DNS interne',
    competenceCode: 'CP4',
    ccpCode: 'CCP1',
    priority: 'moyenne',
    status: 'en-cours',
    updatedAt: 'Il y a 2h',
  },
  {
    id: 'INC-152',
    incidentId: '152',
    title: 'VM critique indisponible sur le cluster',
    competenceCode: 'CP5',
    ccpCode: 'CCP2',
    priority: 'urgent',
    status: 'a-faire',
    updatedAt: 'Hier',
  },
  {
    id: 'INC-115',
    incidentId: '115',
    title: 'Tâche planifiée / script d’automatisation en échec',
    competenceCode: 'CP6',
    ccpCode: 'CCP2',
    priority: 'moyenne',
    status: 'a-faire',
    updatedAt: 'Hier',
  },
  {
    id: 'INC-095',
    incidentId: '095',
    title: 'Règles pare-feu bloquant le VPN site à site',
    competenceCode: 'CP7',
    ccpCode: 'CCP2',
    priority: 'haute',
    status: 'a-faire',
    updatedAt: 'Lun',
  },
  {
    id: 'INC-153',
    incidentId: '153',
    title: 'Échec des sauvegardes nocturnes — espace saturé',
    competenceCode: 'CP8',
    ccpCode: 'CCP2',
    priority: 'urgent',
    status: 'a-faire',
    updatedAt: 'Lun',
  },
  {
    id: 'INC-154',
    incidentId: '154',
    title: 'Déploiement de mises à jour postes de travail bloqué',
    competenceCode: 'CP9',
    ccpCode: 'CCP2',
    priority: 'moyenne',
    status: 'a-faire',
    updatedAt: 'Mar',
  },
];

export const TSSR_MOCK_PROGRESS: LearnerProgress[] = [
  {
    nodeId: 'tssr-cp1',
    status: 'completed',
    completedAt: '2026-05-18',
    hintsUsed: 0,
    timeMinutes: 22,
    xpEarned: 80,
  },
  {
    nodeId: 'tssr-cp3',
    status: 'completed',
    completedAt: '2026-05-20',
    hintsUsed: 1,
    timeMinutes: 28,
    xpEarned: 100,
  },
  { nodeId: 'tssr-cp2', status: 'available' },
  { nodeId: 'tssr-cp4', status: 'in-progress', hintsUsed: 0 },
  { nodeId: 'tssr-cp5', status: 'locked' },
  { nodeId: 'tssr-cp6', status: 'locked' },
  { nodeId: 'tssr-cp7', status: 'locked' },
  { nodeId: 'tssr-cp8', status: 'locked' },
  { nodeId: 'tssr-cp9', status: 'locked' },
];

function isCompetenceValidated(
  competenceCode: string,
  nodes: SkillNode[],
  progress: LearnerProgress[],
): boolean {
  const nodeIds = nodes
    .filter((node) => node.competenceCode === competenceCode)
    .map((node) => node.id);

  return nodeIds.some(
    (nodeId) =>
      progress.find((entry) => entry.nodeId === nodeId)?.status === 'completed',
  );
}

function buildFormationCcps(
  nodes: SkillNode[],
  progress: LearnerProgress[],
): FormationCcp[] {
  return TSSR_CCPS.map((ccp) => ({
    id: ccp.code.toLowerCase(),
    code: ccp.code,
    title: ccp.title,
    description: ccp.description,
    color: CCP_COLORS[ccp.code],
    competences: ccp.competenceNumbers.map((num) => {
      const ref = getTssrCompetenceByNumber(num);
      const tickets = TSSR_TICKETS.filter((t) => t.competenceCode === ref.code);
      return {
        id: ref.code.toLowerCase(),
        code: ref.code,
        label: ref.label,
        validated: isCompetenceValidated(ref.code, nodes, progress),
        ticketIds: tickets.map((t) => t.id),
      };
    }),
  }));
}

export const TSSR_FORMATION_CCPS = buildFormationCcps(
  TSSR_SKILL_NODES,
  TSSR_MOCK_PROGRESS,
);

export const TSSR_PROGRESSION_BUNDLE: FormationProgressionBundle = {
  formationId: 'tssr',
  nodes: TSSR_SKILL_NODES,
  edges: TSSR_SKILL_EDGES,
  tickets: [...TSSR_TICKETS],
  ccps: TSSR_FORMATION_CCPS,
  mockProgress: TSSR_MOCK_PROGRESS,
  referential: {
    badge: `${TSSR_REFERENTIAL_META.sigle} · millésime ${TSSR_REFERENTIAL_META.millesime}`,
    treeLabel: `REAC ${TSSR_REFERENTIAL_META.sigle} 2023`,
    transversalLabels: TSSR_COMPETENCES_TRANSVERSALES,
  },
};
