import React, { useCallback, useContext, useMemo } from 'react';
import DocsPanel from '../../docs/components/DocsPanel';
import { LayoutCtx } from '../../layout/components/Layout';
import type {
  ResourcesNavigate,
  ResourcesSearch,
  ResourcesTab,
} from '../lib/resourcesSearch';
import { getResourcesTheme, resourcesCssVars } from '../resourcesUi';
import RessourcesPanel from './RessourcesPanel';
import shellStyles from './RessourcesShell.module.css';

const TABS: { id: ResourcesTab; label: string }[] = [
  { id: 'catalog', label: 'Pour moi' },
  { id: 'docs', label: 'Docs Kyernal' },
];

export default function RessourcesShell({
  search,
  navigate,
}: {
  search: ResourcesSearch;
  navigate: ResourcesNavigate;
}) {
  const { dark } = useContext(LayoutCtx);
  const theme = getResourcesTheme(dark);
  const cssVars = resourcesCssVars(theme);

  const activeTab = search.tab ?? 'catalog';

  const setTab = useCallback(
    (tab: ResourcesTab) => {
      void navigate({
        search: (prev: ResourcesSearch) => ({
          ...prev,
          tab,
        }),
      });
    },
    [navigate],
  );

  const setDocId = useCallback(
    (docId: string) => {
      void navigate({
        search: (prev: ResourcesSearch) => ({
          ...prev,
          tab: 'docs',
          doc: docId,
        }),
      });
    },
    [navigate],
  );

  const panelSearch = useMemo(
    () => ({
      r: search.r,
      filter: search.filter,
    }),
    [search.r, search.filter],
  );

  return (
    <div className={shellStyles.shell} style={cssVars}>
      <div className={shellStyles.tabBar} role="tablist" aria-label="Ressources">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={`${shellStyles.tab} ${
              activeTab === id ? shellStyles.tabActive : ''
            }`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={shellStyles.body} role="tabpanel">
        {activeTab === 'catalog' ? (
          <RessourcesPanel search={panelSearch} navigate={navigate} />
        ) : (
          <DocsPanel docId={search.doc} onDocChange={setDocId} />
        )}
      </div>
    </div>
  );
}
