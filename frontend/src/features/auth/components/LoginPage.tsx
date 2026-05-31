import { Link, useSearch } from '@tanstack/react-router';
import { useState, type FocusEvent, type FormEvent } from 'react';
import KyernalLogo from '../../landing/components/KyernalLogo';
import { THEMES } from '../../landing/theme/landingTheme';
import { AuthSessionNotice } from './AuthSessionNotice';
import { useAuth } from '../hooks/useAuth';
import { useLogin } from '../hooks/useLogin';

const inputFocusHandlers = (
  t: (typeof THEMES)['dark'],
  borderKey: 'inputBorder' = 'inputBorder',
) => ({
  onFocus: (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = `1px solid ${t.textMuted}`;
  },
  onBlur: (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = `1px solid ${t[borderKey]}`;
  },
});

export default function LoginPage() {
  const [mode, setMode] = useState<'dark' | 'light'>('light');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnHovered, setBtnHovered] = useState(false);
  const t = THEMES[mode];
  const loginMutation = useLogin();
  const { redirect } = useSearch({ from: '/login' });
  const { data: session } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const errorMessage =
    loginMutation.error instanceof Error
      ? loginMutation.error.message
      : loginMutation.isError
        ? 'Connexion impossible. Réessayez.'
        : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.4,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '50vh',
          background: `radial-gradient(ellipse, ${t.haloBg} 0%, transparent 70%)`,
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '56px',
          borderBottom: `1px solid ${t.borderMuted}`,
          background: t.navBg,
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: t.text,
          }}
        >
          <KyernalLogo size={20} dark={mode === 'light'} />
          <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.2px' }}>
            Kyernal
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: `1px solid ${t.border}`,
            background: t.bgCard,
            color: t.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
          title={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          {mode === 'dark' ? '☀' : '◐'}
        </button>
      </nav>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 72px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: '10px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                margin: '0 0 8px 0',
                color: t.text,
              }}
            >
              Connexion
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: t.textSub,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Accédez à votre espace Kyernal
            </p>
          </div>

          <AuthSessionNotice session={session} redirect={redirect} t={t} />

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            noValidate
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="login-email"
                style={{
                  fontSize: '10px',
                  color: t.textMuted,
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                }}
              >
                IDENTIFIANT ÉCOLE OU ENTREPRISE
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@infrastructure.fr"
                disabled={loginMutation.isPending}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 16px',
                  borderRadius: '7px',
                  border: `1px solid ${t.inputBorder}`,
                  background: t.inputBg,
                  color: t.text,
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                {...inputFocusHandlers(t)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '10px',
                    color: t.textMuted,
                    fontWeight: 600,
                    letterSpacing: '0.3px',
                  }}
                >
                  MOT DE PASSE
                </label>
                <button
                  type="button"
                  disabled
                  title="Bientôt disponible"
                  style={{
                    fontSize: '10px',
                    color: t.textFaint,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'not-allowed',
                  }}
                >
                  Oublié ?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loginMutation.isPending}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 16px',
                  borderRadius: '7px',
                  border: `1px solid ${t.inputBorder}`,
                  background: t.inputBg,
                  color: t.text,
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                {...inputFocusHandlers(t)}
              />
            </div>

            {errorMessage && (
              <p
                role="alert"
                aria-live="polite"
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#e5484d',
                  lineHeight: 1.4,
                }}
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                height: '40px',
                borderRadius: '7px',
                background: t.btnPrimary,
                color: t.btnPrimaryText,
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: loginMutation.isPending ? 'wait' : 'pointer',
                opacity: loginMutation.isPending ? 0.7 : btnHovered ? 0.88 : 1,
                transition: 'opacity 0.15s',
                marginTop: '4px',
              }}
            >
              {loginMutation.isPending ? 'Connexion…' : "S'authentifier"}
            </button>
          </form>

          <p style={{ margin: 0, fontSize: '12px', color: t.textSub, textAlign: 'center' }}>
            Pas encore de compte ?{' '}
            <Link
              to="/signup"
              style={{ color: t.text, fontWeight: 600, textDecoration: 'none' }}
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '18px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${t.borderMuted}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', opacity: 0.6 }}>
          <KyernalLogo size={13} dark={mode === 'light'} />
          <span style={{ fontSize: '11px', color: t.textMuted, fontWeight: 500 }}>
            Kyernal
          </span>
        </div>
        <span
          style={{
            fontSize: '10px',
            color: t.textFaint,
            fontFamily: 'monospace',
          }}
        >
          France · RGPD · 2026
        </span>
      </div>
    </div>
  );
}
