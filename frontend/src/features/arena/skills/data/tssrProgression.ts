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
import { computeNodeStatus } from './progressionConfig';

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
    id: 'tssr-cp1-pwd',
    incidentId: 'INC-155',
    title: 'Mot de passe expiré',
    description:
      'Réinitialisation AD, politique de mot de passe et vérification de la connexion.',
    domain: 'linux',
    level: 'novice',
    xp: 60,
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    position: { x: 60, y: 80 },
  },
  {
    id: 'tssr-cp1-print',
    incidentId: 'INC-156',
    title: 'Imprimante réseau',
    description:
      'File d’attente, pilote, spooler et test d’impression depuis le poste utilisateur.',
    domain: 'linux',
    level: 'novice',
    xp: 55,
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    position: { x: 60, y: 360 },
  },
  {
    id: 'tssr-cp1-vpn',
    incidentId: 'INC-157',
    title: 'VPN télétravail',
    description:
      'Client VPN, certificat, authentification MFA et connectivité distante.',
    domain: 'linux',
    level: 'novice',
    xp: 65,
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    position: { x: 180, y: 140 },
  },
  {
    id: 'tssr-cp1-share',
    incidentId: 'INC-158',
    title: 'Dossier partagé',
    description:
      'Droits NTFS, mappage réseau, chemins UNC et validation des accès.',
    domain: 'linux',
    level: 'novice',
    xp: 55,
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    position: { x: 180, y: 300 },
  },
  {
    id: 'tssr-cp1-slow',
    incidentId: 'INC-159',
    title: 'Poste lent',
    description:
      'Diagnostic rapide, processus gourmands, espace disque et redémarrage contrôlé.',
    domain: 'linux',
    level: 'novice',
    xp: 50,
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    position: { x: 180, y: 220 },
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
    description:
      'Une utilisatrice du service RH ne peut plus accéder à sa boîte Exchange depuis ce matin. Outlook affiche une erreur de connexion et OWA est inaccessible.',
    objectives: [
      { text: 'Vérifier la connectivité réseau et les services Exchange' },
      { text: 'Tester l’accès OWA et les identifiants du compte' },
      { text: 'Escalader vers l’administrateur messagerie si nécessaire' },
    ],
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    priority: 'haute',
    status: 'a-faire',
    updatedAt: "Aujourd'hui",
  },
  {
    id: 'INC-155',
    incidentId: '155',
    title: 'Mot de passe expiré — compte verrouillé',
    description:
      'Un collaborateur ne peut plus se connecter à son poste : son mot de passe a expiré et le compte Active Directory est verrouillé après plusieurs tentatives.',
    objectives: [
      { text: 'Déverrouiller le compte dans l’annuaire AD' },
      { text: 'Réinitialiser le mot de passe selon la politique de sécurité' },
      { text: 'Valider la connexion au poste et aux applications métier' },
    ],
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    priority: 'moyenne',
    status: 'a-faire',
    updatedAt: "Aujourd'hui",
  },
  {
    id: 'INC-156',
    incidentId: '156',
    title: 'Imprimante réseau — file d’attente bloquée',
    description:
      'L’imprimante du open space ne répond plus. Les documents restent bloqués dans la file d’attente Windows et le spooler semble planté.',
    objectives: [
      { text: 'Vider la file d’attente et redémarrer le spooler d’impression' },
      { text: 'Vérifier le pilote et la connexion réseau de l’imprimante' },
      { text: 'Effectuer un test d’impression depuis le poste utilisateur' },
    ],
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    priority: 'basse',
    status: 'a-faire',
    updatedAt: "Aujourd'hui",
  },
  {
    id: 'INC-157',
    incidentId: '157',
    title: 'Échec connexion VPN — télétravail',
    description:
      'Un télétravailleur ne parvient pas à établir le tunnel VPN depuis son domicile. Le client affiche « authentification échouée » malgré un mot de passe valide.',
    objectives: [
      { text: 'Contrôler la configuration du client VPN et le certificat' },
      { text: 'Vérifier l’authentification MFA et les droits du compte' },
      { text: 'Tester la connectivité distante vers les ressources internes' },
    ],
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    priority: 'haute',
    status: 'a-faire',
    updatedAt: 'Il y a 2h',
  },
  {
    id: 'INC-158',
    incidentId: '158',
    title: 'Accès refusé — dossier partagé comptabilité',
    description:
      'Un comptable n’a plus accès au partage réseau \\srv-files\compta. Windows renvoie « accès refusé » alors que ses collègues y accèdent normalement.',
    objectives: [
      { text: 'Vérifier les droits NTFS et les groupes AD de l’utilisateur' },
      { text: 'Contrôler le mappage réseau et le chemin UNC' },
      { text: 'Valider l’accès en lecture/écriture au dossier partagé' },
    ],
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    priority: 'moyenne',
    status: 'a-faire',
    updatedAt: 'Il y a 3h',
  },
  {
    id: 'INC-159',
    incidentId: '159',
    title: 'Poste utilisateur très lent — service commercial',
    description:
      'Le poste d’un commercial met plusieurs minutes à démarrer et les applications mettent du temps à s’ouvrir. L’utilisateur signale des lenteurs depuis hier.',
    objectives: [
      { text: 'Identifier les processus gourmands en ressources' },
      { text: 'Vérifier l’espace disque et les programmes au démarrage' },
      { text: 'Proposer un redémarrage contrôlé et valider les performances' },
    ],
    competenceCode: 'CP1',
    ccpCode: 'CCP1',
    priority: 'basse',
    status: 'a-faire',
    updatedAt: 'Hier',
  },
  {
    id: 'INC-151',
    incidentId: '151',
    title: 'Échec d’authentification domaine Active Directory',
    description:
      'Plusieurs postes du site ne parviennent plus à joindre le contrôleur de domaine. Les utilisateurs reçoivent « aucun serveur d’ouverture de session disponible ».',
    objectives: [
      { text: 'Diagnostiquer la connectivité vers le contrôleur de domaine' },
      { text: 'Vérifier les comptes, droits et réplication AD' },
      { text: 'Restaurer l’authentification domaine sur les postes impactés' },
    ],
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
    description:
      'Le service nginx sur srv-web-01 est en état failed depuis le redémarrage nocturne. Le site interne est inaccessible.',
    objectives: [
      { text: 'Analyser les journaux systemd et nginx (journalctl)' },
      { text: 'Identifier la cause du crash et corriger la configuration' },
      { text: 'Relancer le service et valider la disponibilité du site' },
    ],
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
    description:
      'Les résolutions de noms internes échouent sur le réseau du lab. Les pings vers les serveurs par nom renvoient NXDOMAIN.',
    objectives: [
      { text: 'Vérifier l’état du service bind9 et les zones DNS' },
      { text: 'Tester la résolution avec dig et nslookup' },
      { text: 'Corriger la configuration et valider la résolution interne' },
    ],
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
    description:
      'La VM vm-app-prod ne démarre plus sur l’hyperviseur. L’application métier est hors service depuis 30 minutes.',
    objectives: [
      { text: 'Diagnostiquer l’état de la VM sur l’hyperviseur' },
      { text: 'Vérifier les ressources du cluster et les logs d’hôte' },
      { text: 'Redémarrer ou migrer la VM et confirmer la disponibilité' },
    ],
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
    description:
      'Le script de sauvegarde quotidien lancé par cron a échoué cette nuit. Aucune alerte n’a été remontée aux administrateurs.',
    objectives: [
      { text: 'Consulter les logs du cron et la sortie du script' },
      { text: 'Corriger l’erreur d’exécution ou les droits du compte' },
      { text: 'Relancer la tâche et vérifier la planification' },
    ],
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
    description:
      'Le tunnel VPN entre le site principal et le site distant est down. Les règles pare-feu semblent bloquer le trafic IPSec depuis la dernière mise à jour.',
    objectives: [
      { text: 'Analyser les logs pare-feu et l’état du tunnel VPN' },
      { text: 'Identifier les règles bloquantes et les flux autorisés' },
      { text: 'Corriger la configuration et rétablir la connectivité inter-sites' },
    ],
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
    description:
      'Les sauvegardes Veeam ont échoué trois nuits de suite. Le dépôt de backup est plein à 98 % et les jobs sont en erreur.',
    objectives: [
      { text: 'Vérifier l’espace disque et les rétentions de sauvegarde' },
      { text: 'Libérer ou étendre le dépôt de backup' },
      { text: 'Relancer un job de test et valider la restauration' },
    ],
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
    description:
      'WSUS n’a pas déployé les mises à jour de sécurité sur le parc Windows depuis la semaine dernière. 40 % des postes sont en retard.',
    objectives: [
      { text: 'Diagnostiquer WSUS et l’état de synchronisation' },
      { text: 'Vérifier les groupes de déploiement et les agents clients' },
      { text: 'Relancer le déploiement et contrôler l’application des correctifs' },
    ],
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

const TSSR_CANONICAL_NODE_BY_COMPETENCE: Partial<Record<string, string>> = {
  CP1: 'tssr-cp1',
};

function isCompetenceValidated(
  competenceCode: string,
  nodes: SkillNode[],
  progress: LearnerProgress[],
  edges: SkillEdge[],
): boolean {
  const canonicalId = TSSR_CANONICAL_NODE_BY_COMPETENCE[competenceCode];
  if (canonicalId) {
    return computeNodeStatus(canonicalId, progress, edges) === 'completed';
  }

  const nodeIds = nodes
    .filter((node) => node.competenceCode === competenceCode)
    .map((node) => node.id);

  return nodeIds.some(
    (nodeId) => computeNodeStatus(nodeId, progress, edges) === 'completed',
  );
}

export function buildTssrFormationCcps(
  nodes: SkillNode[],
  progress: LearnerProgress[],
  edges: SkillEdge[],
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
        validated: isCompetenceValidated(ref.code, nodes, progress, edges),
        ticketIds: tickets.map((t) => t.id),
      };
    }),
  }));
}

export const TSSR_PROGRESSION_BUNDLE: FormationProgressionBundle = {
  formationId: 'tssr',
  nodes: TSSR_SKILL_NODES,
  edges: TSSR_SKILL_EDGES,
  tickets: [...TSSR_TICKETS],
  ccps: buildTssrFormationCcps(TSSR_SKILL_NODES, [], TSSR_SKILL_EDGES),
  progress: [],
  referential: {
    badge: `${TSSR_REFERENTIAL_META.sigle} · millésime ${TSSR_REFERENTIAL_META.millesime}`,
    treeLabel: `REAC ${TSSR_REFERENTIAL_META.sigle} 2023`,
    transversalLabels: TSSR_COMPETENCES_TRANSVERSALES,
  },
};
