import React, { useContext, useMemo, useState } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import { getResourcesTheme } from '../../resources/resourcesUi';
import DocsMarkdown from './DocsMarkdown';
import { DOCS, FOLDERS } from '../data/docsData';
import styles from './DocsPanel.module.css';

const DEFAULT_DOC_ID = 'apache';

const IconFolder = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconFile = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconSearch = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

function resolveDocId(docId?: string): string {
  if (docId && DOCS.some((d) => d.id === docId)) return docId;
  return DEFAULT_DOC_ID;
}

export default function DocsPanel({
  docId,
  onDocChange,
}: {
  docId?: string;
  onDocChange?: (id: string) => void;
}) {
  const { dark } = useContext(LayoutCtx);
  const theme = getResourcesTheme(dark);
  const selectedId = resolveDocId(docId);

  const selectDoc = (id: string) => {
    onDocChange?.(id);
  };

  const [search, setSearch] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    services: true,
    reseau: false,
    securite: false,
    systeme: false,
  });

  const selectedDoc = useMemo(
    () => DOCS.find((doc) => doc.id === selectedId) ?? DOCS[0],
    [selectedId],
  );

  const filteredDocs = search
    ? DOCS.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.content.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.panel}>
      <aside className={styles.tree}>
        <div className={styles.treeHeader}>
          <div className={styles.treeTitle}>Fiches internes</div>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden>
              <IconSearch />
            </span>
            <input
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
            />
          </div>
        </div>

        <div className={styles.treeScroll}>
          {search && filteredDocs ? (
            filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  className={`${styles.treeRow} ${
                    doc.id === selectedId ? styles.treeRowActive : ''
                  }`}
                  onClick={() => {
                    selectDoc(doc.id);
                    setSearch('');
                  }}
                >
                  <span className={styles.iconMuted}>
                    <IconFile />
                  </span>
                  {doc.title}
                </button>
              ))
            ) : (
              <div className={styles.emptySearch}>Aucun résultat</div>
            )
          ) : (
            FOLDERS.map((folder) => {
              const pages = DOCS.filter((d) => d.folder === folder.id);
              const isOpen = openFolders[folder.id];
              return (
                <div key={folder.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    className={styles.folderRow}
                    onClick={() => toggleFolder(folder.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleFolder(folder.id);
                      }
                    }}
                  >
                    <IconChevron open={isOpen} />
                    <span className={styles.iconMuted}>
                      <IconFolder />
                    </span>
                    {folder.label}
                    <span className={styles.folderCount}>{pages.length}</span>
                  </div>
                  {isOpen &&
                    pages.map((page) => (
                      <div
                        key={page.id}
                        role="button"
                        tabIndex={0}
                        className={`${styles.pageRow} ${
                          page.id === selectedId ? styles.pageRowActive : ''
                        }`}
                        onClick={() => selectDoc(page.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selectDoc(page.id);
                          }
                        }}
                      >
                        <span className={styles.iconMuted}>
                          <IconFile />
                        </span>
                        {page.title}
                      </div>
                    ))}
                </div>
              );
            })
          )}
        </div>
      </aside>

      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <span className={styles.contentTitle}>{selectedDoc.title}</span>
          {selectedDoc.related && selectedDoc.related.length > 0 && (
            <div className={styles.related}>
              <span className={styles.relatedLabel}>Voir aussi :</span>
              {selectedDoc.related.map((relId) => {
                const rel = DOCS.find((d) => d.id === relId);
                if (!rel) return null;
                return (
                  <button
                    key={relId}
                    type="button"
                    className={styles.relatedBtn}
                    onClick={() => selectDoc(relId)}
                  >
                    <IconLink />
                    {rel.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.contentBody}>
          <DocsMarkdown
            content={selectedDoc.content}
            dark={dark}
            border={theme.border}
            textMain={theme.textMain}
            textMuted={theme.textMuted}
            onNavigate={selectDoc}
          />
        </div>
      </div>
    </div>
  );
}
