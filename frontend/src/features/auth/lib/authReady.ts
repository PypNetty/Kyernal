import { hasSelectedFormation } from '../data/formations';
import type { AuthSession } from '../types';

export function isAuthReady(
  session: AuthSession | null | undefined,
): boolean {
  return Boolean(session && hasSelectedFormation(session));
}

export function needsFormationSelection(
  session: AuthSession | null | undefined,
): boolean {
  return Boolean(session && !hasSelectedFormation(session));
}
