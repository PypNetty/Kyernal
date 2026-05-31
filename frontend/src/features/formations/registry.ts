/** Formations avec un bundle REAC / dédié prêt pour l’Arena. */
export const DEDICATED_FORMATION_IDS = new Set(['tssr']);

export function hasDedicatedProgression(formationId?: string | null): boolean {
  return Boolean(formationId && DEDICATED_FORMATION_IDS.has(formationId));
}
