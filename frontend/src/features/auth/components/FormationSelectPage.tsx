import { Link, useSearch } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import KyernalLogo from '../../landing/components/KyernalLogo';
import { THEMES } from '../../landing/theme/landingTheme';
import { FORMATIONS } from '../data/formations';
import { TSSR_COMPETENCES, TSSR_REFERENTIAL_META } from '../data/tssrReferential';
import { useAuth } from '../hooks/useAuth';
import { useSelectFormation } from '../hooks/useSelectFormation';

export default function FormationSelectPage() {
  const [mode, setMode] = useState<'dark' | 'light'>('light');
  const [selectedId, setSelectedId] = useState(FORMATIONS[0]?.id ?? '');
  const [learningGoal, setLearningGoal] = useState('');
  const [btnHovered, setBtnHovered] = useState(false);
  const t = THEMES[mode];
  const { redirect, change } = useSearch({ from: '/formation' });
  const { data: session } = useAuth();
  const selectMutation = useSelectFormation();

  useEffect(() => {
    if (session?.formationId) setSelectedId(session.formationId);
    if (session?.learningGoal) setLearningGoal(session.learningGoal);
  }, [session?.formationId, session?.learningGoal]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    selectMutation.mutate({
      formationId: selectedId,
      learningGoal: learningGoal.trim() || undefined,
    });
  };

  const errorMessage =
    selectMutation.error instanceof Error
      ? selectMutation.error.message
      : selectMutation.isError
        ? 'Impossible de valider votre parcours.'
        : null;

  const selectedFormation = FORMATIONS.find((f) => f.id === selectedId);
  const isTssr = selectedId === 'tssr';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
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
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Kyernal</span>
        </Link>
      </nav>

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '720px',
          margin: '0 auto',
          padding: '96px 24px 48px',
        }}
      >
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: 600,
            letterSpacing: '-0.5px',
          }}
        >
          Choisissez votre formation
        </h1>
        <p style={{ margin: '0 0 32px', fontSize: '14px', color: t.textMuted }}>
          {change
            ? 'Modifiez le parcours affiché dans votre espace Arena.'
            : "Indiquez le parcours sur lequel vous travaillez. L'espace Arena s'adaptera à votre formation."}
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            {FORMATIONS.map((formation) => {
              const isSelected = selectedId === formation.id;
              return (
                <button
                  key={formation.id}
                  type="button"
                  onClick={() => setSelectedId(formation.id)}
                  style={{
                    textAlign: 'left',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    border: `1px solid ${isSelected ? formation.accent : t.border}`,
                    background: isSelected
                      ? mode === 'dark'
                        ? `${formation.accent}18`
                        : `${formation.accent}0d`
                      : t.bgCard,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: t.text,
                      }}
                    >
                      {formation.name}
                    </span>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      {formation.ccps.map((ccp) => (
                        <span
                          key={ccp}
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: `${formation.accent}22`,
                            color: formation.accent,
                          }}
                        >
                          {ccp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      color: t.textMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    {formation.description}
                  </p>
                </button>
              );
            })}
          </div>

          {isTssr && selectedFormation && (
            <div
              style={{
                marginBottom: '24px',
                padding: '16px 18px',
                borderRadius: '10px',
                border: `1px solid ${selectedFormation.accent}33`,
                background:
                  mode === 'dark'
                    ? `${selectedFormation.accent}12`
                    : `${selectedFormation.accent}08`,
              }}
            >
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: selectedFormation.accent,
                }}
              >
                Référentiel {TSSR_REFERENTIAL_META.sigle} · {TSSR_REFERENTIAL_META.code}{' '}
                · millésime {TSSR_REFERENTIAL_META.millesime}
              </p>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: t.textMuted, lineHeight: 1.5 }}>
                À la validation, vous accédez à l’arbre des 9 compétences professionnelles
                et aux tickets d’entraînement associés (2 blocs CCP).
              </p>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  fontSize: '12px',
                  color: t.text,
                  lineHeight: 1.6,
                }}
              >
                {TSSR_COMPETENCES.map((cp) => (
                  <li key={cp.code}>
                    <strong style={{ color: selectedFormation.accent }}>{cp.code}</strong>{' '}
                    — {cp.label}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <label
            htmlFor="learning-goal"
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 500,
              color: t.textMuted,
              marginBottom: '8px',
            }}
          >
            Votre objectif (optionnel)
          </label>
          <textarea
            id="learning-goal"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="Ex. Valider le CCP2 avant le jury, renforcer Apache et systemd…"
            rows={3}
            disabled={selectMutation.isPending}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 14px',
              borderRadius: '8px',
              border: `1px solid ${t.inputBorder}`,
              background: t.bgCard,
              color: t.text,
              fontSize: '13px',
              fontFamily: 'inherit',
              resize: 'vertical',
              marginBottom: '20px',
            }}
          />

          {errorMessage && (
            <p
              style={{
                margin: '0 0 16px',
                fontSize: '13px',
                color: '#ef4444',
              }}
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={selectMutation.isPending || !selectedId}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '8px',
              border: 'none',
              background: t.btnPrimaryBg,
              color: t.btnPrimaryText,
              fontSize: '14px',
              fontWeight: 600,
              cursor: selectMutation.isPending ? 'wait' : 'pointer',
              opacity: selectMutation.isPending ? 0.7 : btnHovered ? 0.88 : 1,
            }}
          >
            {selectMutation.isPending
              ? 'Chargement…'
              : "Accéder à l'Arena"}
          </button>
        </form>

        <p
          style={{
            marginTop: '16px',
            fontSize: '12px',
            color: t.textMuted,
            textAlign: 'center',
          }}
        >
          Redirection vers{' '}
          <code style={{ fontSize: '11px' }}>{redirect}</code> après validation
        </p>
      </main>
    </div>
  );
}
