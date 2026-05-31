import { Link } from '@tanstack/react-router';
import { THEMES } from '../../landing/theme/landingTheme';
import { isAuthReady, needsFormationSelection } from '../lib/authReady';
import type { AuthSession } from '../types';

type Theme = (typeof THEMES)['dark'];

const noticeStyle = (t: Theme) =>
  ({
    margin: 0,
    padding: '10px 12px',
    borderRadius: '8px',
    background: t.badgeBg,
    border: `1px solid ${t.badgeBorder}`,
    fontSize: '12px',
    color: t.textSub,
    lineHeight: 1.5,
  }) as const;

const linkStyle = (t: Theme) =>
  ({
    color: t.text,
    fontWeight: 600,
  }) as const;

export function AuthSessionNotice({
  session,
  redirect,
  t,
}: {
  session: AuthSession | null | undefined;
  redirect: string;
  t: Theme;
}) {
  if (!session) return null;

  const boxStyle = noticeStyle(t);
  const name = session.user.name;

  if (isAuthReady(session)) {
    return (
      <p style={boxStyle}>
        Vous êtes déjà connecté en tant que{' '}
        <strong style={{ color: t.text }}>{name}</strong>.{' '}
        <Link to={redirect} style={linkStyle(t)}>
          Continuer
        </Link>
      </p>
    );
  }

  if (needsFormationSelection(session)) {
    return (
      <p style={boxStyle}>
        Vous êtes connecté en tant que{' '}
        <strong style={{ color: t.text }}>{name}</strong>.{' '}
        <Link
          to="/formation"
          search={{ redirect, change: false }}
          style={linkStyle(t)}
        >
          Choisir votre formation
        </Link>
      </p>
    );
  }

  return null;
}
