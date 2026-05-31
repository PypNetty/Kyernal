import type { LearnerProgress } from '../../arena/skills/data/progressionConfig';

const STORAGE_PREFIX = 'kyernal.progress';

function storageKey(email: string, formationId: string): string {
  return `${STORAGE_PREFIX}.${email.trim().toLowerCase()}.${formationId}`;
}

export function getLearnerProgress(
  email: string,
  formationId: string,
): LearnerProgress[] | null {
  try {
    const raw = localStorage.getItem(storageKey(email, formationId));
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as LearnerProgress[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function setLearnerProgress(
  email: string,
  formationId: string,
  progress: LearnerProgress[],
): void {
  localStorage.setItem(
    storageKey(email, formationId),
    JSON.stringify(progress),
  );
}

/** Initialise une progression vide pour un nouveau parcours (sans écraser l'existant). */
export function ensureLearnerProgress(
  email: string,
  formationId: string,
): LearnerProgress[] {
  const existing = getLearnerProgress(email, formationId);
  if (existing !== null) return existing;

  const empty: LearnerProgress[] = [];
  setLearnerProgress(email, formationId, empty);
  return empty;
}
