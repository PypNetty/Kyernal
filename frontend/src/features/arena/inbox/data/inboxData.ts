import type {
  FormationTicket,
  TicketObjective,
} from '../../skills/data/formationBundleTypes';

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
  ticketRouteId?: string;
  description?: string;
  objectives?: TicketObjective[];
  priority?: FormationTicket['priority'];
  competenceCode?: string;
  ccpCode?: string;
  ticketStatus?: FormationTicket['status'];
}

export const INBOX_FILTERS = [
  ['all', 'Tous'],
  ['incident', 'Incidents'],
  ['formateur', 'Formateur'],
  ['system', 'Système'],
] as const;

export const STATIC_INBOX_MESSAGES: InboxMessage[] = [
  {
    id: 'static-formateur-035',
    type: 'formateur',
    from: 'Marc Lefebvre',
    fromInitials: 'ML',
    fromColor: '#30a46c',
    subject: 'Retour sur ton lab INC-035 — Bien joué',
    preview:
      "J'ai regardé ta session d'hier. Ta démarche de diagnostic était...",
    body: `Salut Henryck,\n\nJ'ai regardé le replay de ta session sur l'incident #INC-035 (fail2ban). Ta démarche de diagnostic était vraiment solide, tu as commencé par les logs avant de toucher à la config, c'est exactement ce qu'on attend d'un technicien en conditions réelles.\n\nUn point à améliorer : pense à vérifier \`systemctl status\` avant \`journalctl\`, ça te donnera un aperçu plus rapide de l'état du service.\n\nContinue comme ça, tu es bien parti pour le jury. Si tu bloques sur quoi que ce soit, n'hésite pas.\n\nBonne continuation,\nMarc`,
    timestamp: 'Hier',
    status: 'read',
    tags: ['Feedback', 'fail2ban'],
  },
  {
    id: 'static-system-vm',
    type: 'system',
    from: 'Système',
    fromInitials: 'S',
    fromColor: '#8a8a93',
    subject: 'Votre session VM a expiré',
    preview:
      "La VM vm-apprenant-03 a été détruite après 2h d'inactivité...",
    body: `La machine virtuelle **vm-apprenant-03** associée à un incident a été automatiquement détruite après 2 heures d'inactivité.\n\nVos actions dans le terminal ont été enregistrées et sont consultables dans l'onglet **Mes tickets**.\n\nVous pouvez relancer une nouvelle session à tout moment depuis un ticket actif.`,
    timestamp: 'Lun',
    status: 'read',
    tags: ['VM', 'Auto-destroy'],
  },
  {
    id: 'static-formateur-ssh',
    type: 'formateur',
    from: 'Marc Lefebvre',
    fromInitials: 'ML',
    fromColor: '#30a46c',
    subject: 'Nouveau module disponible: Sécurité SSH',
    preview:
      "J'ai ajouté 3 nouveaux incidents autour du durcissement SSH...",
    body: `Bonjour Henryck,\n\nJ'ai ajouté 3 nouveaux incidents dans la catégorie **Sécurité SSH** pour compléter ta préparation au bloc CCP3.\n\nLes scénarios couvrent :\n- Désactivation de l'authentification par mot de passe\n- Configuration de fail2ban pour SSH\n- Audit des clés autorisées\n\nCes labs sont marqués "Avancé": prends-les après avoir validé les tickets précédents du parcours.\n\nÀ bientôt,\nMarc`,
    timestamp: 'Dim',
    status: 'read',
    tags: ['CCP3', 'SSH', 'Nouveau'],
  },
];

export const tagColor = (tag: string): { bg: string; color: string } => {
  if (tag === 'Critique') return { bg: 'rgba(255,80,80,0.12)', color: '#ff6b6b' };
  if (tag === 'Moyen') return { bg: 'rgba(255,180,0,0.12)', color: '#ffb800' };
  if (tag === 'Avancé') return { bg: 'rgba(160,100,255,0.12)', color: '#b06fff' };
  if (tag === 'Nouveau') return { bg: 'rgba(48,164,108,0.12)', color: '#30a46c' };
  if (tag === 'Feedback') return { bg: 'rgba(48,164,108,0.12)', color: '#30a46c' };
  if (tag === 'Urgent') return { bg: 'rgba(255,80,80,0.12)', color: '#ff6b6b' };
  if (tag === 'Haute') return { bg: 'rgba(255,180,0,0.12)', color: '#ffb800' };
  if (tag === 'Moyenne') return { bg: 'rgba(138,138,147,0.1)', color: '#8a8a93' };
  if (tag === 'Basse') return { bg: 'rgba(138,138,147,0.1)', color: '#8a8a93' };
  if (['CCP1', 'CCP2', 'CCP3'].includes(tag))
    return { bg: 'rgba(0,85,229,0.12)', color: '#4d8fff' };
  return { bg: 'rgba(138,138,147,0.1)', color: '#8a8a93' };
};
