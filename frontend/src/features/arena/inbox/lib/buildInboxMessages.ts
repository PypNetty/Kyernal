import type { FormationProgressionBundle } from '../../skills/data/formationBundleTypes';
import { getLearnerTickets } from '../../../progress';
import { MOCK_RESOURCES } from '../../resources/data/resourcesData';
import { getResourcesForTicket } from '../../resources/lib/getTicketResources';
import { PRIORITY_CONFIG } from '../../tickets/ticketUi';
import {
  STATIC_INBOX_MESSAGES,
  type InboxMessage,
} from '../data/inboxData';

function firstSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^[^.!?]+[.!?]?/);
  const sentence = match?.[0]?.trim() ?? trimmed;
  return sentence.length > 120 ? `${sentence.slice(0, 117)}...` : sentence;
}

function incidentNotificationBody(
  ticket: ReturnType<typeof getLearnerTickets>[number],
): string {
  const resourceCount = getResourcesForTicket(ticket, MOCK_RESOURCES).length;
  const resourceHint =
    resourceCount > 0
      ? ` ${resourceCount} ressource${resourceCount > 1 ? 's' : ''} utile${resourceCount > 1 ? 's' : ''} t'attendent dans Mes tickets et Ressources.`
      : '';

  if (ticket.status === 'en-cours') {
    return `Tu as une session en cours sur ${ticket.id}. Reprends le diagnostic quand tu es prêt — le scénario complet et les objectifs sont dans Mes tickets.${resourceHint}`;
  }
  return `Un nouveau ticket vient d'être assigné à ton parcours (${ticket.id}). Consulte-le pour lire le contexte incident et la checklist avant d'ouvrir le lab.${resourceHint}`;
}

function inboxTagsForTicket(
  ccpCode: string,
  priority: keyof typeof PRIORITY_CONFIG,
): string[] {
  const tags = [ccpCode, PRIORITY_CONFIG[priority].label];
  return [...new Set(tags)];
}

function ticketToInboxMessage(
  ticket: ReturnType<typeof getLearnerTickets>[number],
): InboxMessage {
  const description = ticket.description ?? '';
  const preview = firstSentence(description) || ticket.title;
  return {
    id: `incident-${ticket.id}`,
    type: 'incident',
    from: 'Klixy Arena',
    fromInitials: 'K',
    fromColor: '#0055e5',
    subject: ticket.title,
    preview,
    body: incidentNotificationBody(ticket),
    timestamp: ticket.updatedAt,
    status: ticket.status === 'a-faire' ? 'unread' : 'read',
    incidentId: ticket.id,
    ticketRouteId: ticket.incidentId,
    priority: ticket.priority,
    competenceCode: ticket.competenceCode,
    ccpCode: ticket.ccpCode,
    ticketStatus: ticket.status,
    tags: inboxTagsForTicket(ticket.ccpCode, ticket.priority),
  };
}

function sortIncidentMessages(messages: InboxMessage[]): InboxMessage[] {
  const order = (m: InboxMessage) =>
    m.ticketStatus === 'en-cours' ? 0 : m.ticketStatus === 'a-faire' ? 1 : 2;
  return [...messages].sort((a, b) => order(a) - order(b));
}

export function buildInboxMessages(
  bundle: FormationProgressionBundle,
): InboxMessage[] {
  const tickets = getLearnerTickets(bundle).filter(
    (t) => t.status === 'a-faire' || t.status === 'en-cours',
  );
  const incidents = sortIncidentMessages(tickets.map(ticketToInboxMessage));
  return [...incidents, ...STATIC_INBOX_MESSAGES];
}
