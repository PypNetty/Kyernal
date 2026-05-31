import type { LearnerProgress } from '../../arena/skills/data/progressionConfig';

const STORAGE_PREFIX = 'kyernal.progress';
const PROGRESS_EVENT = 'kyernal:learner-progress';

let progressRevision = 0;

function storageKey(email: string, formationId: string): string {
  return `${STORAGE_PREFIX}.${email.trim().toLowerCase()}.${formationId}`;
}

export function getProgressRevision(): number {
  return progressRevision;
}

export function subscribeLearnerProgress(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(PROGRESS_EVENT, handler);
  return () => window.removeEventListener(PROGRESS_EVENT, handler);
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
  progressRevision += 1;
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
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
