export type MessageType = 'incident' | 'formateur' | 'system';
export type MessageStatus = 'unread' | 'read' | 'active';

export interface InboxMessage {
  id: string;
  type: MessageType;
  from: string;
  fromInitials: string;
  fromColor: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  status: MessageStatus;
  incidentId?: string;
  tags?: string[];
}

/** @deprecated use INBOX_FILTER_TABS from inboxConfig */
export const INBOX_FILTERS = [
  ['all', 'Tous'],
  ['incident', 'Incidents'],
  ['formateur', 'Formateur'],
  ['system', 'Système'],
] as const;

export const MOCK_MESSAGES: InboxMessage[] = [
  {
    id: '1',
    type: 'incident',
    from: 'Kyernal Arena',
    fromInitials: 'K',
    fromColor: '#5e6ad2',
    subject: 'INC-042 — Apache ne répond plus sur le port 80',
    preview:
      'Le serveur web de la RH ne répond plus depuis ce matin…',
    body: `Un incident a été détecté sur l'infrastructure RH.

**Contexte :** Le serveur Apache hébergé sur \`srv-rh-01\` ne répond plus aux requêtes HTTP depuis 08h14.

**Environnement :** Debian 13 · Apache 2.4 · Port 80/443

**Objectif :** Diagnostiquer la panne, identifier la cause racine et remettre le service en ligne.

**Compétence visée :** CP3 — Serveurs Linux`,
    timestamp: '09:42',
    status: 'unread',
    incidentId: 'INC-042',
    tags: ['CCP1', 'Apache', 'Critique'],
  },
  {
    id: '2',
    type: 'incident',
    from: 'Kyernal Arena',
    fromInitials: 'K',
    fromColor: '#5e6ad2',
    subject: 'INC-088 — Problème DNS interne',
    preview: 'Impossible de résoudre les noms de domaine du lab…',
    body: `Incident de résolution DNS détecté sur le réseau interne du lab.

**Contexte :** Les machines du lab ne parviennent plus à résoudre les noms de domaine internes (\`*.kyernal.local\`).

**Environnement :** Bind9 · Debian 13 · Réseau 10.0.0.0/24

**Objectif :** Identifier la mauvaise configuration DNS et valider avec \`dig\`.

**Compétence visée :** CP4 — Réseau IP`,
    timestamp: 'Hier',
    status: 'read',
    incidentId: 'INC-088',
    tags: ['CCP1', 'DNS', 'Moyen'],
  },
  {
    id: '3',
    type: 'formateur',
    from: 'Marc Lefebvre',
    fromInitials: 'ML',
    fromColor: '#30a46c',
    subject: 'Retour sur ton lab INC-035 — Bien joué',
    preview:
      "J'ai regardé ta session d'hier. Ta démarche de diagnostic était…",
    body: `Salut,

J'ai regardé le replay de ta session sur l'incident INC-035 (fail2ban). Ta démarche de diagnostic était solide — tu as commencé par les logs avant de toucher à la config.

Un point à améliorer : pense à vérifier \`systemctl status\` avant \`journalctl\`.

Continue comme ça,

Marc`,
    timestamp: 'Hier',
    status: 'read',
    tags: ['Feedback', 'fail2ban'],
  },
  {
    id: '4',
    type: 'system',
    from: 'Système',
    fromInitials: 'S',
    fromColor: '#8a8f98',
    subject: 'Votre session VM a expiré',
    preview:
      "La VM vm-apprenant-03 a été détruite après 2h d'inactivité…",
    body: `La machine virtuelle **vm-apprenant-03** a été automatiquement détruite après 2 heures d'inactivité.

Vos actions dans le terminal ont été enregistrées.

Vous pouvez relancer une nouvelle session depuis **Issues**.`,
    timestamp: 'Lun',
    status: 'read',
    tags: ['VM', 'Auto-destroy'],
  },
  {
    id: '5',
    type: 'incident',
    from: 'Kyernal Arena',
    fromInitials: 'K',
    fromColor: '#5e6ad2',
    subject: 'INC-101 — Espace disque critique sur /var',
    preview:
      'Le volume /var est à 97% de capacité, des services commencent…',
    body: `Alerte critique : saturation disque imminente.

**Contexte :** Le volume \`/var\` du serveur \`srv-prod-02\` est à 97% de capacité.

**Environnement :** Debian 13 · LVM · ext4

**Objectif :** Identifier les fichiers qui consomment l'espace et nettoyer proprement.

**Compétence visée :** CP3 — Serveurs Linux`,
    timestamp: 'Lun',
    status: 'read',
    incidentId: 'INC-101',
    tags: ['CCP1', 'Disque', 'Critique'],
  },
  {
    id: '6',
    type: 'formateur',
    from: 'Marc Lefebvre',
    fromInitials: 'ML',
    fromColor: '#30a46c',
    subject: 'Nouveau module disponible : Sécurité SSH',
    preview:
      "J'ai ajouté 3 nouveaux incidents autour du durcissement SSH…",
    body: `Bonjour,

J'ai ajouté 3 nouveaux incidents dans la catégorie **Sécurité SSH** pour compléter ta préparation.

Les scénarios couvrent :
- Désactivation de l'authentification par mot de passe
- Configuration de fail2ban pour SSH
- Audit des clés autorisées

Ces labs sont marqués "Avancé" — prends-les après Apache et DNS.

Marc`,
    timestamp: 'Dim',
    status: 'read',
    tags: ['CCP2', 'SSH', 'Nouveau'],
  },
];
