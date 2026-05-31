// ── progressionConfig.ts ─────────────────────────────────────────────────
// Graphe de progression générique (fallback) + types et utilitaires partagés.
// Les parcours dédiés (ex. TSSR) vivent dans des bundles via formationProgression.ts.

export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'completed';
export type NodeLevel =
  | 'novice'
  | 'junior'
  | 'confirmé'
  | 'expert'
  | 'architecte';
export type NodeDomain = 'linux' | 'reseau' | 'securite' | 'web' | 'cloud';
export type NodeBranch = 'approfondissement' | 'nouveauté';

export interface SkillNode {
  id: string;
  incidentId?: string; // INC-042 etc.
  title: string;
  description: string;
  domain: NodeDomain;
  level: NodeLevel;
  xp: number; // XP gagnés à la résolution
  badge?: string; // badge débloqué si présent
  docsId?: string; // lien /ressources?tab=docs&doc=…
  position: { x: number; y: number }; // position sur le canvas
  /** Référentiel TSSR (CP1–CP9) */
  competenceCode?: string;
  ccpCode?: 'CCP1' | 'CCP2';
}

export interface SkillEdge {
  id: string;
  source: string; // id du nœud source
  target: string; // id du nœud cible
  branch?: NodeBranch; // type de fourche
  label?: string;
}

// ── NŒUDS ────────────────────────────────────────────────────────────────
export const SKILL_NODES: SkillNode[] = [
  // ── LINUX ──
  {
    id: 'linux-base',
    incidentId: 'INC-001',
    title: 'Premiers pas Linux',
    description: 'Navigation filesystem, permissions de base, utilisateurs.',
    domain: 'linux',
    level: 'novice',
    xp: 50,
    badge: 'Initié Linux',
    docsId: 'gestion-disque',
    position: { x: 80, y: 200 },
  },
  {
    id: 'linux-services',
    incidentId: 'INC-021',
    title: 'Gestion des services',
    description: 'systemctl, journalctl, debug de services en échec.',
    domain: 'linux',
    level: 'junior',
    xp: 80,
    docsId: 'systemd',
    position: { x: 300, y: 100 },
  },
  {
    id: 'linux-disque',
    incidentId: 'INC-101',
    title: 'Espace disque critique',
    description: 'df, du, nettoyage apt, gestion LVM.',
    domain: 'linux',
    level: 'junior',
    xp: 80,
    docsId: 'gestion-disque',
    position: { x: 300, y: 300 },
  },
  {
    id: 'linux-logs',
    incidentId: 'INC-035',
    title: 'Maîtrise des logs',
    description: 'journalctl avancé, logrotate, grep sur gros fichiers.',
    domain: 'linux',
    level: 'confirmé',
    xp: 120,
    badge: 'Log Master',
    docsId: 'logs-systeme',
    position: { x: 540, y: 100 },
  },
  // ── WEB ──
  {
    id: 'web-apache',
    incidentId: 'INC-042',
    title: 'Apache — panne port 80',
    description: 'Diagnostic Apache, virtual hosts, configtest.',
    domain: 'web',
    level: 'junior',
    xp: 100,
    badge: 'Web Responder',
    docsId: 'apache',
    position: { x: 540, y: 300 },
  },
  {
    id: 'web-nginx',
    incidentId: 'INC-055',
    title: 'Nginx — 502 Bad Gateway',
    description: 'Reverse proxy, upstream PHP-FPM, logs Nginx.',
    domain: 'web',
    level: 'confirmé',
    xp: 120,
    docsId: 'nginx',
    position: { x: 760, y: 200 },
  },
  {
    id: 'web-tls',
    incidentId: 'INC-070',
    title: 'Certificats TLS expirés',
    description: 'Renouvellement certbot, configuration HTTPS.',
    domain: 'web',
    level: 'confirmé',
    xp: 150,
    position: { x: 760, y: 380 },
  },
  // ── RÉSEAU ──
  {
    id: 'reseau-dns',
    incidentId: 'INC-088',
    title: 'Panne DNS interne',
    description: 'Bind9, zones, dig, nslookup.',
    domain: 'reseau',
    level: 'junior',
    xp: 100,
    docsId: 'dns',
    position: { x: 300, y: 500 },
  },
  {
    id: 'reseau-firewall',
    incidentId: 'INC-095',
    title: 'Règles firewall bloquantes',
    description: 'iptables, nftables, diagnostic de connectivité.',
    domain: 'reseau',
    level: 'confirmé',
    xp: 130,
    position: { x: 540, y: 500 },
  },
  // ── SÉCURITÉ ──
  {
    id: 'secu-ssh',
    incidentId: 'INC-077',
    title: 'Durcissement SSH',
    description: 'sshd_config, clés ED25519, désactivation root.',
    domain: 'securite',
    level: 'confirmé',
    xp: 150,
    badge: 'SSH Hardener',
    docsId: 'ssh-hardening',
    position: { x: 760, y: 560 },
  },
  {
    id: 'secu-fail2ban',
    incidentId: 'INC-035',
    title: 'fail2ban — IP légitimes bannies',
    description: 'Jails, unban, filtres personnalisés.',
    domain: 'securite',
    level: 'confirmé',
    xp: 120,
    docsId: 'fail2ban',
    position: { x: 980, y: 460 },
  },
  {
    id: 'secu-audit',
    incidentId: 'INC-110',
    title: 'Audit de sécurité complet',
    description: 'lynis, auditd, rapport de conformité CIS.',
    domain: 'securite',
    level: 'expert',
    xp: 200,
    badge: 'Security Auditor',
    position: { x: 1200, y: 500 },
  },
];

// ── LIENS ─────────────────────────────────────────────────────────────────
export const SKILL_EDGES: SkillEdge[] = [
  {
    id: 'e1',
    source: 'linux-base',
    target: 'linux-services',
    branch: 'nouveauté',
  },
  {
    id: 'e2',
    source: 'linux-base',
    target: 'linux-disque',
    branch: 'approfondissement',
  },
  { id: 'e3', source: 'linux-base', target: 'reseau-dns', branch: 'nouveauté' },
  {
    id: 'e4',
    source: 'linux-services',
    target: 'linux-logs',
    branch: 'approfondissement',
  },
  {
    id: 'e5',
    source: 'linux-services',
    target: 'web-apache',
    branch: 'nouveauté',
  },
  {
    id: 'e6',
    source: 'linux-disque',
    target: 'web-apache',
    branch: 'nouveauté',
  },
  { id: 'e7', source: 'linux-logs', target: 'web-nginx', branch: 'nouveauté' },
  {
    id: 'e8',
    source: 'web-apache',
    target: 'web-nginx',
    branch: 'approfondissement',
  },
  {
    id: 'e9',
    source: 'web-nginx',
    target: 'web-tls',
    branch: 'approfondissement',
  },
  {
    id: 'e10',
    source: 'reseau-dns',
    target: 'reseau-firewall',
    branch: 'approfondissement',
  },
  { id: 'e11', source: 'web-apache', target: 'secu-ssh', branch: 'nouveauté' },
  {
    id: 'e12',
    source: 'reseau-firewall',
    target: 'secu-ssh',
    branch: 'nouveauté',
  },
  {
    id: 'e13',
    source: 'secu-ssh',
    target: 'secu-fail2ban',
    branch: 'approfondissement',
  },
  {
    id: 'e14',
    source: 'secu-fail2ban',
    target: 'secu-audit',
    branch: 'approfondissement',
  },
];

// ── PROGRESSION (état apprenant — viendra du backend) ─────────────────────
export interface LearnerProgress {
  nodeId: string;
  status: NodeStatus;
  completedAt?: string;
  hintsUsed?: number;
  timeMinutes?: number;
  xpEarned?: number;
}

export const MOCK_PROGRESS: LearnerProgress[] = [
  {
    nodeId: 'linux-base',
    status: 'completed',
    completedAt: '2026-05-20',
    hintsUsed: 0,
    timeMinutes: 14,
    xpEarned: 50,
  },
  {
    nodeId: 'linux-services',
    status: 'completed',
    completedAt: '2026-05-21',
    hintsUsed: 0,
    timeMinutes: 12,
    xpEarned: 80,
  },
  {
    nodeId: 'linux-disque',
    status: 'completed',
    completedAt: '2026-05-22',
    hintsUsed: 2,
    timeMinutes: 31,
    xpEarned: 60,
  },
  {
    nodeId: 'linux-logs',
    status: 'completed',
    completedAt: '2026-05-24',
    hintsUsed: 0,
    timeMinutes: 18,
    xpEarned: 120,
  },
  { nodeId: 'web-apache', status: 'in-progress', hintsUsed: 2 },
  { nodeId: 'reseau-dns', status: 'available' },
  { nodeId: 'web-nginx', status: 'locked' },
  { nodeId: 'web-tls', status: 'locked' },
  { nodeId: 'reseau-firewall', status: 'locked' },
  { nodeId: 'secu-ssh', status: 'locked' },
  { nodeId: 'secu-fail2ban', status: 'locked' },
  { nodeId: 'secu-audit', status: 'locked' },
];

// ── NIVEAUX XP ────────────────────────────────────────────────────────────
export const XP_LEVELS: {
  level: NodeLevel;
  min: number;
  max: number;
  color: string;
}[] = [
  { level: 'novice', min: 0, max: 199, color: '#8a8a93' },
  { level: 'junior', min: 200, max: 499, color: '#4d8fff' },
  { level: 'confirmé', min: 500, max: 999, color: '#30a46c' },
  { level: 'expert', min: 1000, max: 1999, color: '#f59e0b' },
  { level: 'architecte', min: 2000, max: 9999, color: '#a78bfa' },
];

export function getCurrentLevel(totalXp: number) {
  return (
    XP_LEVELS.find((l) => totalXp >= l.min && totalXp <= l.max) ?? XP_LEVELS[0]
  );
}

export function getTotalXp(progress: LearnerProgress[]): number {
  return progress.reduce((sum, p) => sum + (p.xpEarned ?? 0), 0);
}

// ── CALCUL DES STATUTS ────────────────────────────────────────────────────
export function computeNodeStatus(
  nodeId: string,
  progress: LearnerProgress[],
  edges: SkillEdge[],
): NodeStatus {
  const existing = progress.find((p) => p.nodeId === nodeId);
  if (existing) return existing.status;
  const prereqs = edges.filter((e) => e.target === nodeId).map((e) => e.source);
  if (prereqs.length === 0) return 'available';
  const allDone = prereqs.every((pid) => {
    const p = progress.find((x) => x.nodeId === pid);
    return p?.status === 'completed';
  });
  return allDone ? 'available' : 'locked';
}

// ── COULEURS DOMAINE ──────────────────────────────────────────────────────
export const DOMAIN_COLORS: Record<NodeDomain, string> = {
  linux: '#4d8fff',
  reseau: '#22d3ee',
  securite: '#a78bfa',
  web: '#30a46c',
  cloud: '#f59e0b',
};
