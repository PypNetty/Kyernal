export interface Formation {
  id: string;
  name: string;
  description: string;
  ccps: string[];
  roleLabel: string;
  accent: string;
}

export const FORMATIONS: Formation[] = [
  {
    id: 'tssr',
    name: 'TSSR',
    description:
      'Technicien supérieur systèmes et réseaux (TP-01351, millésime 02) — 2 blocs, 9 compétences professionnelles REAC 2023.',
    ccps: ['CCP1', 'CCP2'],
    roleLabel: 'Apprenant · TSSR',
    accent: '#0055e5',
  },
  {
    id: 'ais',
    name: 'AIS',
    description:
      'Administrateur d’Infrastructures Sécurisées — durcissement, supervision et incidents.',
    ccps: ['CCP2', 'CCP3'],
    roleLabel: 'Apprenant · AIS',
    accent: '#b06fff',
  },
  {
    id: 'devops',
    name: 'DevOps',
    description:
      'Chaîne DevOps — CI/CD, conteneurs, automatisation et exploitation cloud.',
    ccps: ['CCP2', 'CCP3'],
    roleLabel: 'Apprenant · DevOps',
    accent: '#30a46c',
  },
  {
    id: 'dwwm',
    name: 'DWWM',
    description:
      'Développeur Web et Web Mobile — déploiement, serveurs web et environnements.',
    ccps: ['CCP2'],
    roleLabel: 'Apprenant · DWWM',
    accent: '#ffb800',
  },
  {
    id: 'cda',
    name: 'CDA',
    description:
      'Concepteur Développeur d’Applications — architecture, déploiement et ops applicatives.',
    ccps: ['CCP2', 'CCP3'],
    roleLabel: 'Apprenant · CDA',
    accent: '#ff6b6b',
  },
];

export function getFormationById(id: string): Formation | undefined {
  return FORMATIONS.find((f) => f.id === id);
}

export function hasSelectedFormation(session: {
  formationId?: string;
} | null): boolean {
  return Boolean(
    session?.formationId && getFormationById(session.formationId),
  );
}
