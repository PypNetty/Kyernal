import { useMemo } from 'react';
import { useAuth } from '../../../auth';
import { getFormationProgression } from '../data/formationProgression';
import type { FormationProgressionBundle } from '../data/formationBundleTypes';

export function useFormationBundle(): FormationProgressionBundle {
  const { data: session } = useAuth();
  return useMemo(
    () => getFormationProgression(session?.formationId),
    [session?.formationId],
  );
}
