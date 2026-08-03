import type { FormationProgressionBundle } from '../../skills/data/formationBundleTypes';
import type { TicketData } from '../../layout/context/types';

function priorityToSeverity(
  priority: 'urgent' | 'haute' | 'moyenne' | 'basse',
): TicketData['severity'] {
  if (priority === 'urgent' || priority === 'haute') return 'Critique';
  if (priority === 'moyenne') return 'Moyen';
  return 'Mineur';
}

export function resolveTicketByIncidentId(
  bundle: FormationProgressionBundle,
  incidentId: string,
): TicketData | null {
  const ticket = bundle.tickets.find(
    (t) => t.incidentId === incidentId || t.id === `INC-${incidentId}`,
  );
  if (!ticket) return null;

  const node = bundle.nodes.find(
    (n) =>
      n.incidentId === ticket.id ||
      n.incidentId?.replace(/^INC-/, '') === incidentId,
  );

  return {
    id: ticket.incidentId,
    title: ticket.title,
    description: node?.description ?? ticket.title,
    reporter: 'Service Desk Kyernal',
    duration: ticket.updatedAt,
    server: `vm-lab-${ticket.incidentId}`,
    os: 'Debian 13',
    severity: priorityToSeverity(ticket.priority),
    objectives: [
      { text: 'Diagnostiquer la cause du problème', done: false, active: true },
      { text: 'Appliquer la correction', done: false, active: false },
      {
        text: 'Vérifier le retour à la normale du service',
        done: false,
        active: false,
      },
    ],
  };
}
