/**
 * Référentiel TSSR — millésime 02 (arrêté 26/04/2023, REAC validé 24/05/2023).
 * TP-01351 — Technicien supérieur systèmes et réseaux, niveau 5.
 */

export const TSSR_REFERENTIAL_META = {
  sigle: 'TSSR',
  code: 'TP-01351',
  millesime: '02',
  title: 'Technicien supérieur systèmes et réseaux',
  niveau: 5,
  dateValidation: '2023-05-24',
} as const;

export const TSSR_ACTIVITY_1 =
  'Exploiter les éléments de l’infrastructure et assurer le support aux utilisateurs';
export const TSSR_ACTIVITY_2 =
  'Maintenir l’infrastructure et contribuer à son évolution et à sa sécurisation';

export type TssrCompetenceCode =
  | 'CP1'
  | 'CP2'
  | 'CP3'
  | 'CP4'
  | 'CP5'
  | 'CP6'
  | 'CP7'
  | 'CP8'
  | 'CP9';

export interface TssrCompetenceProfessionnelle {
  number: number;
  code: TssrCompetenceCode;
  label: string;
  ccpCode: 'CCP1' | 'CCP2';
  activityLabel: string;
}

export interface TssrCcp {
  code: 'CCP1' | 'CCP2';
  title: string;
  description: string;
  competenceNumbers: number[];
}

export const TSSR_COMPETENCES: TssrCompetenceProfessionnelle[] = [
  {
    number: 1,
    code: 'CP1',
    label: 'Assurer le support utilisateur en centre de services',
    ccpCode: 'CCP1',
    activityLabel: TSSR_ACTIVITY_1,
  },
  {
    number: 2,
    code: 'CP2',
    label: 'Exploiter des serveurs Windows et un domaine Active Directory',
    ccpCode: 'CCP1',
    activityLabel: TSSR_ACTIVITY_1,
  },
  {
    number: 3,
    code: 'CP3',
    label: 'Exploiter des serveurs Linux',
    ccpCode: 'CCP1',
    activityLabel: TSSR_ACTIVITY_1,
  },
  {
    number: 4,
    code: 'CP4',
    label: 'Exploiter un réseau IP',
    ccpCode: 'CCP1',
    activityLabel: TSSR_ACTIVITY_1,
  },
  {
    number: 5,
    code: 'CP5',
    label: 'Maintenir des serveurs dans une infrastructure virtualisée',
    ccpCode: 'CCP2',
    activityLabel: TSSR_ACTIVITY_2,
  },
  {
    number: 6,
    code: 'CP6',
    label: 'Automatiser des tâches à l’aide de scripts',
    ccpCode: 'CCP2',
    activityLabel: TSSR_ACTIVITY_2,
  },
  {
    number: 7,
    code: 'CP7',
    label:
      'Maintenir et sécuriser les accès à Internet et les interconnexions des réseaux',
    ccpCode: 'CCP2',
    activityLabel: TSSR_ACTIVITY_2,
  },
  {
    number: 8,
    code: 'CP8',
    label:
      'Mettre en place, assurer et tester les sauvegardes et les restaurations des éléments de l’infrastructure',
    ccpCode: 'CCP2',
    activityLabel: TSSR_ACTIVITY_2,
  },
  {
    number: 9,
    code: 'CP9',
    label: 'Exploiter et maintenir les services de déploiement des postes de travail',
    ccpCode: 'CCP2',
    activityLabel: TSSR_ACTIVITY_2,
  },
];

export const TSSR_CCPS: TssrCcp[] = [
  {
    code: 'CCP1',
    title: TSSR_ACTIVITY_1,
    description:
      'Support en centre de services, exploitation Windows / Active Directory, Linux et réseau IP.',
    competenceNumbers: [1, 2, 3, 4],
  },
  {
    code: 'CCP2',
    title: TSSR_ACTIVITY_2,
    description:
      'Infrastructure virtualisée, scripts, sécurisation des accès et interconnexions, sauvegardes, déploiement des postes.',
    competenceNumbers: [5, 6, 7, 8, 9],
  },
];

export const TSSR_COMPETENCES_TRANSVERSALES = [
  'Communiquer',
  'Mettre en œuvre une démarche de résolution de problème',
  'Apprendre en continu',
] as const;

export function getTssrCompetenceByCode(
  code: TssrCompetenceCode,
): TssrCompetenceProfessionnelle | undefined {
  return TSSR_COMPETENCES.find((c) => c.code === code);
}
