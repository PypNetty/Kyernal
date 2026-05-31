import { ensureLearnerProgress } from '../../arena/skills/lib/learnerProgressStorage';
import {
  clearStoredSession,
  getStoredPassword,
  getStoredSession,
  setStoredPassword,
  setStoredSession,
} from '../lib/authStorage';
import { getFormationById } from '../data/formations';
import { deriveLearnerProfileFromEmail } from '../lib/learnerProfile';
import {
  derivePresenceStatus,
  type PresenceActivity,
} from '../lib/presenceStatus';
import type {
  AuthSession,
  ChangePasswordInput,
  LoginCredentials,
  SelectFormationInput,
  UpdateProfileInput,
} from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  await delay(300);

  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email.includes('@')) {
    throw new Error('Adresse e-mail invalide.');
  }
  if (!password.trim()) {
    throw new Error('Mot de passe requis.');
  }

  const storedPassword = getStoredPassword(email);
  if (storedPassword === null) {
    throw new Error('Compte introuvable. Créez un compte pour continuer.');
  }
  if (storedPassword !== password) {
    throw new Error('Mot de passe incorrect.');
  }

  const session: AuthSession = {
    token: `mock-${crypto.randomUUID()}`,
    email,
    user: deriveLearnerProfileFromEmail(email),
  };

  setStoredSession(session);
  return session;
}

export async function signup(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  await delay(300);

  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email.includes('@')) {
    throw new Error('Adresse e-mail invalide.');
  }
  if (password.trim().length < 8) {
    throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
  }

  const storedPassword = getStoredPassword(email);
  if (storedPassword !== null) {
    throw new Error('Un compte existe déjà avec cette adresse e-mail.');
  }

  setStoredPassword(email, password);

  const session: AuthSession = {
    token: `mock-${crypto.randomUUID()}`,
    email,
    user: deriveLearnerProfileFromEmail(email),
  };

  setStoredSession(session);
  return session;
}

export function getSession(): AuthSession | null {
  return getStoredSession();
}

export async function selectFormation(
  input: SelectFormationInput,
): Promise<AuthSession> {
  await delay(200);

  const session = getStoredSession();
  if (!session) {
    throw new Error('Session expirée. Reconnectez-vous.');
  }

  const formation = getFormationById(input.formationId);
  if (!formation) {
    throw new Error('Formation invalide.');
  }

  const updated: AuthSession = {
    ...session,
    formationId: formation.id,
    learningGoal: input.learningGoal?.trim() || undefined,
    targetCcps: [...formation.ccps],
    presenceStatus: session.presenceStatus ?? 'actif',
    user: {
      ...session.user,
      organization: formation.name,
      role: formation.roleLabel,
    },
  };

  setStoredSession(updated);
  ensureLearnerProgress(updated.email, formation.id);
  return updated;
}

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<AuthSession> {
  await delay(200);

  const session = getStoredSession();
  if (!session) {
    throw new Error('Session expirée. Reconnectez-vous.');
  }

  const formation = getFormationById(input.formationId);
  if (!formation) {
    throw new Error('Formation invalide.');
  }

  const allowed = new Set(formation.ccps);
  const targetCcps = input.targetCcps.filter((ccp) => allowed.has(ccp));
  if (targetCcps.length === 0) {
    throw new Error('Sélectionnez au moins un bloc visé.');
  }

  const updated: AuthSession = {
    ...session,
    formationId: formation.id,
    learningGoal: input.learningGoal?.trim() || undefined,
    targetCcps,
    user: {
      ...session.user,
      organization: formation.name,
      role: formation.roleLabel,
    },
  };

  setStoredSession(updated);
  ensureLearnerProgress(updated.email, formation.id);
  return updated;
}

export async function setDndEnabled(
  enabled: boolean,
  activity: Omit<PresenceActivity, 'dndEnabled'>,
): Promise<AuthSession> {
  await delay(100);

  const session = getStoredSession();
  if (!session) {
    throw new Error('Session expirée. Reconnectez-vous.');
  }

  const updated: AuthSession = {
    ...session,
    dndEnabled: enabled,
    presenceStatus: derivePresenceStatus({ ...activity, dndEnabled: enabled }),
  };

  setStoredSession(updated);
  return updated;
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<void> {
  await delay(200);

  const session = getStoredSession();
  if (!session) {
    throw new Error('Session expirée. Reconnectez-vous.');
  }

  const currentPassword = input.currentPassword.trim();
  const newPassword = input.newPassword.trim();
  const confirmPassword = input.confirmPassword.trim();

  if (!currentPassword) {
    throw new Error('Mot de passe actuel requis.');
  }
  if (newPassword.length < 8) {
    throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
  }
  if (newPassword !== confirmPassword) {
    throw new Error('Les mots de passe ne correspondent pas.');
  }

  const storedPassword = getStoredPassword(session.email);
  if (storedPassword !== null && storedPassword !== currentPassword) {
    throw new Error('Mot de passe actuel incorrect.');
  }

  setStoredPassword(session.email, newPassword);
}

export function logout(): void {
  clearStoredSession();
}
