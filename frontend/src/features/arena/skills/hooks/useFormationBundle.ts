import { useMemo, useSyncExternalStore } from 'react';
import { useAuth } from '../../../auth';
import {
  deriveFormationCcps,
  getFormationProgression,
} from '../data/formationProgression';
import type { FormationProgressionBundle } from '../data/formationBundleTypes';
import {
  getLearnerProgress,
  getProgressRevision,
  subscribeLearnerProgress,
} from '../../../progress';

export function useFormationBundle(): FormationProgressionBundle {
  const { data: session } = useAuth();
  const progressRevision = useSyncExternalStore(
    subscribeLearnerProgress,
    getProgressRevision,
    () => 0,
  );

  return useMemo(() => {
    const base = getFormationProgression(session?.formationId);

    if (!session?.email || !session.formationId) {
      return { ...base, progress: [], ccps: deriveFormationCcps(base, []) };
    }

    const progress = getLearnerProgress(session.email, session.formationId) ?? [];

    return {
      ...base,
      progress,
      ccps: deriveFormationCcps(base, progress),
    };
  }, [session?.email, session?.formationId, progressRevision]);
}
