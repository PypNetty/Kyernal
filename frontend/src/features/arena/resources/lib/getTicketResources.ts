import type {
  FormationProgressionBundle,
  FormationTicket,
} from '../../skills/data/formationBundleTypes';
import type { Resource } from '../data/resourcesData';
import { getLearnerActiveTickets } from './getLearnerActiveCcps';

const TRANSVERSAL_RESOURCE_IDS = ['16', '17'];
const MAX_RESOURCES = 5;

function resourceByIdMap(
  allResources: Resource[],
): Map<string, Resource> {
  return new Map(allResources.map((r) => [r.id, r]));
}

function dedupeResources(resources: Resource[]): Resource[] {
  const seen = new Set<string>();
  return resources.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}

export function getResourcesForTicket(
  ticket: FormationTicket,
  allResources: Resource[],
): Resource[] {
  if (ticket.status === 'verrouille') return [];

  const byId = resourceByIdMap(allResources);
  const curated =
    ticket.resourceIds
      ?.map((id) => byId.get(id))
      .filter((r): r is Resource => r != null) ?? [];

  const curatedIds = new Set(curated.map((r) => r.id));
  const ccpFallback = allResources
    .filter(
      (r) =>
        r.ccps.includes(ticket.ccpCode) &&
        !curatedIds.has(r.id),
    )
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

  const transversal = TRANSVERSAL_RESOURCE_IDS.map((id) => byId.get(id)).filter(
    (r): r is Resource => r != null,
  );

  return dedupeResources([...curated, ...ccpFallback, ...transversal]).slice(
    0,
    MAX_RESOURCES,
  );
}

export function getResourcesForActiveTickets(
  bundle: FormationProgressionBundle,
  allResources: Resource[],
): Resource[] {
  const activeTickets = getLearnerActiveTickets(bundle);
  const merged = activeTickets.flatMap((ticket) =>
    getResourcesForTicket(ticket, allResources),
  );
  return dedupeResources(merged);
}
