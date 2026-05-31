import type { FormationProgressionBundle } from '../../skills/data/formationBundleTypes';
import { getLearnerTickets } from '../../../progress';

export function getLearnerActiveCcps(
  bundle: FormationProgressionBundle,
): string[] {
  const activeTickets = getLearnerTickets(bundle).filter(
    (t) => t.status === 'a-faire' || t.status === 'en-cours',
  );
  return [...new Set(activeTickets.map((t) => t.ccpCode))];
}

export function getLearnerActiveTickets(
  bundle: FormationProgressionBundle,
) {
  return getLearnerTickets(bundle).filter(
    (t) => t.status === 'a-faire' || t.status === 'en-cours',
  );
}
