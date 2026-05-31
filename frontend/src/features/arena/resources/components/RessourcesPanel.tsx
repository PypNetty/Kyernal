import React, { useContext, useEffect, useMemo, useState } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import {
  ALL_CCPS,
  CATEGORY_LABELS,
  MOCK_RESOURCES,
  type Resource,
  type ResourceType,
} from '../data/resourcesData';
import { getLearnerActiveCcps } from '../lib/getLearnerActiveCcps';
import { getResourcesForActiveTickets } from '../lib/getTicketResources';
import {
  openResourceUrl,
  readResourceViews,
  trackResourceView,
} from '../lib/trackResourceView';

const TYPE_CONFIG: Record<ResourceType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  doc: { label: 'Doc', color: '#4d8fff', bg: 'rgba(0,85,229,0.1)', icon: <span>📄</span> },
  man: { label: 'Man', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', icon: <span>⌨</span> },
  cours: { label: 'Cours', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', icon: <span>🎓</span> },
  cheatsheet: { label: 'Cheatsheet', color: '#30a46c', bg: 'rgba(48,164,108,0.1)', icon: <span>📝</span> },
  video: { label: 'Vidéo', color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: <span>▶</span> },
};

function ResourceCard({
  r,
  dark,
  textMain,
  textMuted,
  cardBorder,
  onOpen,
  views,
  isRelevant,
  activeCcps,
}: {
  r: Resource;
  dark: boolean;
  textMain: string;
  textMuted: string;
  cardBorder: string;
  onOpen: (r: Resource) => void;
  views: number;
  isRelevant: boolean;
  activeCcps: string[];
}) {
  const [hovered, setHovered] = useState(false);
  const typeCfg = TYPE_CONFIG[r.type];
  const isComingSoon = r.type === 'cours' && !r.url;
  const matchingCcps = r.ccps.filter((c) => activeCcps.includes(c));

  return (
    <div
      onClick={() => !isComingSoon && onOpen(r)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '12px 14px',
        borderRadius: '7px',
        border: `1px solid ${hovered && !isComingSoon ? (dark ? '#ffffff22' : '#00000020') : isRelevant ? (dark ? '#ffffff14' : '#00000010') : cardBorder}`,
        background: isRelevant ? (dark ? '#13141a' : '#fafffe') : dark ? '#111113' : '#ffffff',
        cursor: isComingSoon ? 'default' : 'pointer',
        transition: 'border 0.1s, transform 0.1s',
        opacity: isComingSoon ? 0.55 : 1,
        transform: hovered && !isComingSoon ? 'translateY(-1px)' : 'none',
        position: 'relative',
      }}
    >
      {isRelevant && matchingCcps.length > 0 && (
        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '2px', padding: '4px 8px' }}>
          {matchingCcps.map((c) => (
            <span key={c} style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(0,85,229,0.15)', color: '#4d8fff', fontWeight: 700 }}>
              {c}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', paddingRight: isRelevant && matchingCcps.length > 0 ? '40px' : '0' }}>
        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: typeCfg.bg, color: typeCfg.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {typeCfg.icon} {typeCfg.label}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {views > 0 && <span style={{ fontSize: '10px', color: textMuted }}>👁 {views}</span>}
          {isComingSoon && <span style={{ fontSize: '10px', color: textMuted }}>🔒 Bientôt</span>}
          {!isComingSoon && hovered && <span style={{ color: textMuted }}>↗</span>}
        </span>
      </div>

      <div style={{ fontSize: '13px', fontWeight: 600, color: textMain, marginBottom: '4px' }}>{r.title}</div>
      <div style={{ fontSize: '12px', color: textMuted, lineHeight: 1.5, marginBottom: '8px' }}>{r.description}</div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {r.tags.map((tag) => (
          <span key={tag} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: dark ? '#ffffff08' : '#0000000a', color: textMuted }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RessourcesPanel() {
  const { dark } = useContext(LayoutCtx);
  const bundle = useFormationBundle();
  const activeCcps = useMemo(() => getLearnerActiveCcps(bundle), [bundle]);
  const activeTicketResources = useMemo(
    () => getResourcesForActiveTickets(bundle, MOCK_RESOURCES),
    [bundle],
  );
  const activeTicketResourceIds = useMemo(
    () => new Set(activeTicketResources.map((r) => r.id)),
    [activeTicketResources],
  );

  const activeTicketsLabel =
    activeCcps.length > 0 ? activeCcps.join(', ') : 'aucun ticket actif';
  const mesCcpsLabel =
    activeCcps.length > 0
      ? `Mes CCP (${activeCcps.join(', ')})`
      : 'Mes CCP';

  const [ccpFilter, setCcpFilter] = useState<string>('active-tickets');
  const [search, setSearch] = useState('');
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    setViews(readResourceViews());
  }, []);

  const handleOpen = (r: Resource) => {
    if (!r.url) return;
    setViews((prev) => trackResourceView(r.id, prev));
    openResourceUrl(r.url);
  };

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const inputBg = dark ? '#17181a' : '#f0f0ee';
  const cardBorder = dark ? '#27282b' : '#e8e8e5';

  const filtered = MOCK_RESOURCES.filter((r) => {
    const matchCcp =
      ccpFilter === 'all'
        ? true
        : ccpFilter === 'active-tickets'
          ? activeTicketResourceIds.has(r.id)
          : ccpFilter === 'mes-ccps'
            ? activeCcps.length > 0 &&
              r.ccps.some((c) => activeCcps.includes(c))
            : r.ccps.includes(ccpFilter);
    const matchSearch =
      search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCcp && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aRel = activeTicketResourceIds.has(a.id) ? 1 : 0;
    const bRel = activeTicketResourceIds.has(b.id) ? 1 : 0;
    if (bRel !== aRel) return bRel - aRel;
    return (views[b.id] ?? 0) - (views[a.id] ?? 0);
  });

  const grouped = sorted.reduce<Record<string, Resource[]>>((acc, r) => {
    const key = CATEGORY_LABELS[r.category];
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const filterOptions: [string, string][] = [
    ['active-tickets', `Mes tickets actifs (${activeTicketsLabel})`],
    ['mes-ccps', mesCcpsLabel],
    ['all', 'Tout'],
    ...ALL_CCPS.map((c) => [c, c] as [string, string]),
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bg, fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif' }}>
      <div style={{ height: '48px', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: `1px solid ${border}`, gap: '10px', flexShrink: 0 }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>Ressources</span>
        <span style={{ fontSize: '11px', color: textMuted, background: dark ? '#ffffff0f' : '#0000000a', padding: '1px 7px', borderRadius: '10px' }}>{filtered.length}</span>
        <div style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '8px', color: textMuted }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{ paddingLeft: '26px', paddingRight: '10px', height: '28px', borderRadius: '6px', border: `1px solid ${border}`, background: inputBg, color: textMain, fontSize: '12px', outline: 'none', width: '180px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', padding: '8px 20px', borderBottom: `1px solid ${border}`, flexShrink: 0, overflowX: 'auto' }}>
        {filterOptions.map(([val, label]) => (
          <button
            key={val}
            onClick={() => setCcpFilter(val)}
            style={{ padding: '3px 10px', fontSize: '11px', fontWeight: 500, borderRadius: '5px', border: 'none', cursor: 'pointer', flexShrink: 0, background: ccpFilter === val ? (dark ? '#ffffff18' : '#00000012') : 'transparent', color: ccpFilter === val ? textMain : textMuted, transition: 'background 0.1s' }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: textMuted, letterSpacing: '0.5px', marginBottom: '10px' }}>{cat.toUpperCase()}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
              {items.map((r) => (
                <ResourceCard
                  key={r.id}
                  r={r}
                  dark={dark}
                  textMain={textMain}
                  textMuted={textMuted}
                  cardBorder={cardBorder}
                  onOpen={handleOpen}
                  views={views[r.id] ?? 0}
                  isRelevant={activeTicketResourceIds.has(r.id)}
                  activeCcps={activeCcps}
                />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: textMuted, fontSize: '13px', paddingTop: '40px' }}>
            Aucune ressource trouvée
          </div>
        )}
      </div>
    </div>
  );
}
