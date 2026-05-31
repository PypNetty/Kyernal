import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormationBundle } from '../../skills/hooks/useFormationBundle';
import {
  ALL_CCPS,
  CATEGORY_LABELS,
  MOCK_RESOURCES,
  type Resource,
} from '../data/resourcesData';
import type {
  ResourcesNavigate,
  ResourcesSearch,
} from '../lib/resourcesSearch';
import { getLearnerActiveCcps } from '../lib/getLearnerActiveCcps';
import { getResourcesForActiveTickets } from '../lib/getTicketResources';
import {
  openResourceUrl,
  readResourceViews,
  trackResourceView,
} from '../lib/trackResourceView';
import { RESOURCE_TYPE_CONFIG } from '../resourcesUi';
import ResourceDetail from './ResourceDetail';
import styles from './Ressources.module.css';

const PRIMARY_FILTERS = [
  ['active-tickets', 'Pour mes tickets'],
  ['mes-ccps', 'Mes CCP'],
  ['all', 'Tout'],
] as const;

const DEFAULT_FILTER = 'active-tickets';

function pickDefaultId(
  resources: Resource[],
  preferredIds: Set<string>,
): string {
  const preferred = resources.find((r) => preferredIds.has(r.id));
  return preferred?.id ?? resources[0]?.id ?? '';
}

function isCcpFilter(value: string): boolean {
  return ALL_CCPS.includes(value as (typeof ALL_CCPS)[number]);
}

export default function RessourcesPanel({
  search,
  navigate,
}: {
  search: Pick<ResourcesSearch, 'r' | 'filter'>;
  navigate: ResourcesNavigate;
}) {
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

  const filter = search.filter ?? DEFAULT_FILTER;
  const [query, setQuery] = useState('');
  const [views, setViews] = useState(readResourceViews);
  const [mobileDetail, setMobileDetail] = useState(false);

  const urlSelectedId = search.r ?? '';

  const setFilter = useCallback(
    (next: string) => {
      void navigate({
        search: (prev: ResourcesSearch) => ({
          ...prev,
          tab: 'catalog',
          filter: next,
          r: undefined,
        }),
      });
      setMobileDetail(false);
    },
    [navigate],
  );

  const setSelectedId = useCallback(
    (id: string) => {
      void navigate({
        search: (prev: ResourcesSearch) => ({
          ...prev,
          tab: 'catalog',
          r: id || undefined,
        }),
      });
      if (id) setMobileDetail(true);
    },
    [navigate],
  );

  const filtered = useMemo(() => {
    const list = MOCK_RESOURCES.filter((r) => {
      const matchFilter =
        filter === 'all'
          ? true
          : filter === 'active-tickets'
            ? activeTicketResourceIds.has(r.id)
            : filter === 'mes-ccps'
              ? activeCcps.length > 0 &&
                r.ccps.some((c) => activeCcps.includes(c))
              : r.ccps.includes(filter);
      const matchSearch =
        query === '' ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchFilter && matchSearch;
    });

    return [...list].sort((a, b) => {
      const aRel = activeTicketResourceIds.has(a.id) ? 1 : 0;
      const bRel = activeTicketResourceIds.has(b.id) ? 1 : 0;
      if (bRel !== aRel) return bRel - aRel;
      return (views[b.id] ?? 0) - (views[a.id] ?? 0);
    });
  }, [filter, query, activeCcps, activeTicketResourceIds, views]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Resource[]>>((acc, r) => {
      const key = CATEGORY_LABELS[r.category];
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});
  }, [filtered]);

  const displayId = useMemo(() => {
    if (urlSelectedId && filtered.some((r) => r.id === urlSelectedId)) {
      return urlSelectedId;
    }
    if (filtered.length === 0) return '';
    return pickDefaultId(filtered, activeTicketResourceIds);
  }, [urlSelectedId, filtered, activeTicketResourceIds]);

  useEffect(() => {
    if (displayId === urlSelectedId) return;
    void navigate({
      search: (prev: ResourcesSearch) => ({
        ...prev,
        tab: 'catalog',
        r: displayId || undefined,
      }),
    });
  }, [displayId, urlSelectedId, navigate]);

  const selected = filtered.find((r) => r.id === displayId) ?? null;

  const handleOpen = (r: Resource) => {
    if (!r.url) return;
    setViews((prev) => trackResourceView(r.id, prev));
    openResourceUrl(r.url);
  };

  const mesCcpsLabel =
    activeCcps.length > 0 ? `Mes CCP (${activeCcps.join(', ')})` : 'Mes CCP';

  const ccpSelectValue = isCcpFilter(filter) ? filter : '';

  const filterOptions = PRIMARY_FILTERS.map(([val, label]) =>
    val === 'mes-ccps' ? ([val, mesCcpsLabel] as const) : ([val, label] as const),
  );

  const panelClass =
    mobileDetail && selected
      ? `${styles.panel} ${styles.panelMobileDetail}`
      : styles.panel;

  return (
    <div className={panelClass}>
      <aside className={styles.listPane}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>Catalogue</span>
          <span className={styles.countBadge}>{filtered.length}</span>
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon} aria-hidden>
            ⌕
          </span>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une doc, un tag…"
          />
        </div>

        <div className={styles.filterRow}>
          {filterOptions.map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              className={`${styles.filterChip} ${
                filter === val ? styles.filterChipActive : styles.filterChipIdle
              }`}
            >
              {label}
            </button>
          ))}
          <select
            className={styles.ccpSelect}
            value={ccpSelectValue}
            aria-label="Filtrer par CCP"
            onChange={(e) => {
              const v = e.target.value;
              if (v) setFilter(v);
            }}
          >
            <option value="">CCP…</option>
            {ALL_CCPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.listScroll}>
          {filtered.length === 0 && (
            <div className={styles.emptyList}>
              {filter === 'active-tickets' ? (
                <>
                  <p className={styles.emptyTitle}>
                    Aucune ressource liée à tes tickets actifs
                  </p>
                  <p className={styles.emptyHint}>
                    Ouvre un ticket en cours ou explore tout le catalogue.
                  </p>
                  <button
                    type="button"
                    className={styles.emptyAction}
                    onClick={() => setFilter('all')}
                  >
                    Voir tout le catalogue
                  </button>
                </>
              ) : (
                'Aucune ressource trouvée'
              )}
            </div>
          )}
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className={styles.sectionLabel}>{category}</div>
              {items.map((resource) => {
                const isActive = resource.id === displayId;
                const isRelevant = activeTicketResourceIds.has(resource.id);
                const typeCfg = RESOURCE_TYPE_CONFIG[resource.type];

                return (
                  <div
                    key={resource.id}
                    role="button"
                    tabIndex={0}
                    className={`${styles.row} ${
                      isActive ? styles.rowActive : ''
                    } ${isRelevant ? styles.rowRelevant : ''}`}
                    onClick={() => setSelectedId(resource.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(resource.id);
                      }
                    }}
                  >
                    <div className={styles.rowTop}>
                      <span
                        className={styles.typePill}
                        style={{
                          color: typeCfg.color,
                          background: typeCfg.bg,
                        }}
                      >
                        {typeCfg.label}
                      </span>
                      {(views[resource.id] ?? 0) > 0 && (
                        <span className={styles.rowMeta}>
                          {views[resource.id]}×
                        </span>
                      )}
                    </div>
                    <div className={styles.rowTitle}>{resource.title}</div>
                    <div className={styles.rowPreview}>
                      {resource.description}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.detailPane}>
        {selected ? (
          <>
            <button
              type="button"
              className={styles.mobileBack}
              onClick={() => setMobileDetail(false)}
            >
              ← Liste
            </button>
            <div className={styles.detailScroll}>
              <ResourceDetail
                resource={selected}
                views={views[selected.id] ?? 0}
                isRelevant={activeTicketResourceIds.has(selected.id)}
                activeCcps={activeCcps}
                onOpen={handleOpen}
              />
            </div>
          </>
        ) : (
          <div className={styles.detailEmpty}>
            Sélectionne une ressource dans la liste
          </div>
        )}
      </main>
    </div>
  );
}
