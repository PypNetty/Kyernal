import React, { useState, useContext, useEffect } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import type { FormationCcp } from '../data/formationBundleTypes';
import { useFormationBundle } from '../hooks/useFormationBundle';

function getProgress(ccp: FormationCcp) {
  const total = ccp.competences.length;
  const validated = ccp.competences.filter((c) => c.validated).length;
  return { validated, total, pct: Math.round((validated / total) * 100) };
}

export default function CompetencePanel() {
  const { dark } = useContext(LayoutCtx);
  const bundle = useFormationBundle();
  const ccps = bundle.ccps;
  const [selected, setSelected] = useState(ccps[0]?.id ?? '');

  useEffect(() => {
    setSelected(ccps[0]?.id ?? '');
  }, [bundle.formationId]);

  const border = dark ? '#27282b' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const bgDetail = dark ? '#111113' : '#ffffff';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const hoverBg = dark ? '#ffffff0a' : '#00000008';
  const activeBg = dark ? '#ffffff12' : '#00000012';
  const trackBg = dark ? '#27282b' : '#e8e8e5';

  const selectedCCP = ccps.find((c) => c.id === selected) ?? ccps[0];
  if (!selectedCCP) {
    return (
      <div style={{ padding: 24, color: textMuted, fontSize: 13 }}>
        Aucun référentiel de compétences pour cette formation.
      </div>
    );
  }
  const selectedProgress = getProgress(selectedCCP);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        background: bg,
      }}
    >
      <div
        style={{
          width: '260px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${border}`,
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
            Compétences
            {bundle.referential?.badge && (
              <span
                style={{
                  display: 'block',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: textMuted,
                  marginTop: 2,
                }}
              >
                {bundle.referential.badge}
              </span>
            )}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingTop: '8px' }}>
          {ccps.map((ccp) => {
            const { validated, total, pct } = getProgress(ccp);
            const isActive = ccp.id === selected;
            return (
              <div
                key={ccp.id}
                onClick={() => setSelected(ccp.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  margin: '2px 8px',
                  borderRadius: '7px',
                  background: isActive ? activeBg : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: ccp.color,
                    }}
                  >
                    {ccp.code}
                  </span>
                  <span style={{ fontSize: '11px', color: textMuted }}>
                    {validated}/{total}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: textMain,
                    fontWeight: 500,
                    marginBottom: '8px',
                    lineHeight: 1.4,
                  }}
                >
                  {ccp.title}
                </div>

                <div
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    background: trackBg,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '2px',
                      background: ccp.color,
                      width: `${pct}%`,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: textMuted,
                    marginTop: '4px',
                    textAlign: 'right',
                  }}
                >
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}` }}>
          {(() => {
            const totalAll = ccps.reduce(
              (s, c) => s + c.competences.length,
              0,
            );
            const validatedAll = ccps.reduce(
              (s, c) => s + c.competences.filter((x) => x.validated).length,
              0,
            );
            const pctAll = Math.round((validatedAll / totalAll) * 100);
            return (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: textMuted,
                      letterSpacing: '0.4px',
                    }}
                  >
                    PROGRESSION GLOBALE
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: textMain,
                    }}
                  >
                    {pctAll}%
                  </span>
                </div>
                <div
                  style={{
                    height: '5px',
                    borderRadius: '3px',
                    background: trackBg,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '3px',
                      background:
                        'linear-gradient(90deg, #0055e5, #30a46c)',
                      width: `${pctAll}%`,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: bgDetail,
          minWidth: 0,
        }}
      >
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            borderBottom: `1px solid ${border}`,
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: selectedCCP.color,
              letterSpacing: '0.5px',
            }}
          >
            {selectedCCP.code}
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: textMain,
              flex: 1,
            }}
          >
            {selectedCCP.title}
          </span>
          <span style={{ fontSize: '12px', color: textMuted }}>
            {selectedProgress.validated}/{selectedProgress.total} validées
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '5px',
              background: `${selectedCCP.color}18`,
              color: selectedCCP.color,
            }}
          >
            {selectedProgress.pct}%
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <p
            style={{
              fontSize: '13px',
              color: textMuted,
              lineHeight: 1.7,
              marginBottom: '20px',
              marginTop: 0,
            }}
          >
            {selectedCCP.description}
          </p>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                height: '6px',
                borderRadius: '3px',
                background: trackBg,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  background: selectedCCP.color,
                  width: `${selectedProgress.pct}%`,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {(['validated', 'todo'] as const).map((group) => {
            const items = selectedCCP.competences.filter((c) =>
              group === 'validated' ? c.validated : !c.validated,
            );
            if (items.length === 0) return null;

            return (
              <div key={group} style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: textMuted,
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {group === 'validated' ? (
                    <>
                      <span style={{ color: '#30a46c' }}>✓</span> VALIDÉES (
                      {items.length})
                    </>
                  ) : (
                    <>
                      <span style={{ color: textMuted }}>○</span> À VALIDER (
                      {items.length})
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {items.map((comp) => (
                    <div
                      key={comp.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${border}`,
                        background:
                          group === 'validated'
                            ? dark
                              ? 'rgba(48,164,108,0.04)'
                              : 'rgba(48,164,108,0.03)'
                            : 'transparent',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          border: `1.5px solid ${group === 'validated' ? '#30a46c' : border}`,
                          background:
                            group === 'validated' ? '#30a46c' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {group === 'validated' && (
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '13px',
                          flex: 1,
                          color: group === 'validated' ? textMain : textMuted,
                          opacity: group === 'validated' ? 1 : 0.8,
                        }}
                      >
                        {bundle.referential && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: selectedCCP.color,
                              marginRight: 6,
                            }}
                          >
                            {comp.code}
                          </span>
                        )}
                        {comp.label}
                      </span>

                      {comp.ticketIds.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {comp.ticketIds.map((tid) => (
                            <span
                              key={tid}
                              style={{
                                fontSize: '10px',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'rgba(0,85,229,0.1)',
                                color: '#4d8fff',
                                fontWeight: 500,
                              }}
                            >
                              {tid}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {bundle.referential?.transversalLabels && (
            <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${border}` }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: textMuted,
                  letterSpacing: '0.5px',
                  marginBottom: 10,
                }}
              >
                COMPÉTENCES TRANSVERSALES
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  fontSize: '12px',
                  color: textMuted,
                  lineHeight: 1.8,
                }}
              >
                {bundle.referential.transversalLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
