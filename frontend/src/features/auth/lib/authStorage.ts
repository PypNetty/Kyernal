import type { AuthSession, PresenceStatus } from '../types';
import { getFormationById } from '../data/formations';
import { normalizeStoredUser } from './learnerProfile';

const STORAGE_KEY = 'kyernal.auth';
const PASSWORDS_KEY = 'kyernal.auth.passwords';
const DEFAULT_PRESENCE_STATUS: PresenceStatus = 'actif';

type PasswordStore = Record<string, string>;

function readPasswordStore(): PasswordStore {
  try {
    const raw = localStorage.getItem(PASSWORDS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PasswordStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getStoredPassword(email: string): string | null {
  const password = readPasswordStore()[email.trim().toLowerCase()];
  return typeof password === 'string' ? password : null;
}

export function setStoredPassword(email: string, password: string): void {
  const store = readPasswordStore();
  store[email.trim().toLowerCase()] = password;
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(store));
}

function normalizeTargetCcps(
  formationId: string,
  targetCcps: string[] | undefined,
): string[] {
  const formation = getFormationById(formationId);
  if (!formation) return [];

  const allowed = new Set(formation.ccps);
  const selected = (targetCcps ?? []).filter((ccp) => allowed.has(ccp));
  return selected.length > 0 ? selected : [...formation.ccps];
}

function normalizeStoredSession(session: AuthSession): AuthSession {
  const user = normalizeStoredUser(session.user);
  const dndEnabled = session.dndEnabled ?? false;
  const presenceStatus = session.presenceStatus ?? DEFAULT_PRESENCE_STATUS;

  if (session.formationId) {
    const formation = getFormationById(session.formationId);
    if (formation) {
      return {
        ...session,
        dndEnabled,
        presenceStatus,
        targetCcps: normalizeTargetCcps(session.formationId, session.targetCcps),
        user: {
          ...user,
          organization: formation.name,
          role: formation.roleLabel,
        },
      };
    }
  }

  return {
    ...session,
    dndEnabled,
    presenceStatus,
    user: { ...user, organization: undefined },
    formationId: undefined,
    targetCcps: undefined,
  };
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user?.name || !parsed?.email) {
      clearStoredSession();
      return null;
    }
    if (getStoredPassword(parsed.email) === null) {
      clearStoredSession();
      return null;
    }
    return normalizeStoredSession(parsed);
  } catch {
    clearStoredSession();
    return null;
  }
}

export function setStoredSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
