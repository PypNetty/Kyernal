import { useMemo } from 'react';
import { useAuth } from '../../../auth';
import { getFormationProgression } from '../data/formationProgression';
import type { FormationProgressionBundle } from '../data/formationBundleTypes';
import { getLearnerProgress } from '../lib/learnerProgressStorage';

export function useFormationBundle(): FormationProgressionBundle {
  const { data: session } = useAuth();

  return useMemo(() => {
    const base = getFormationProgression(session?.formationId);

    if (!session?.email || !session.formationId) {
      return { ...base, mockProgress: [] };
    }

    const stored = getLearnerProgress(session.email, session.formationId);
    const mockProgress = stored ?? [];

    return { ...base, mockProgress };
  }, [session?.email, session?.formationId]);
}
