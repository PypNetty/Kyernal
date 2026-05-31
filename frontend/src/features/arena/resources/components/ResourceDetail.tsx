import React from 'react';
import { CATEGORY_LABELS, type Resource } from '../data/resourcesData';
import { RESOURCE_TYPE_CONFIG } from '../resourcesUi';
import styles from './Ressources.module.css';

export default function ResourceDetail({
  resource,
  views,
  isRelevant,
  activeCcps,
  onOpen,
}: {
  resource: Resource;
  views: number;
  isRelevant: boolean;
  activeCcps: string[];
  onOpen: (resource: Resource) => void;
}) {
  const typeCfg = RESOURCE_TYPE_CONFIG[resource.type];
  const isComingSoon = resource.type === 'cours' && !resource.url;
  const canOpen = Boolean(resource.url) && !isComingSoon;
  const matchingCcps = resource.ccps.filter((c) => activeCcps.includes(c));

  return (
    <div className={styles.detailCard}>
      <div className={styles.cardBanner}>
        <span
          className={styles.cardType}
          style={{ color: typeCfg.color }}
        >
          {typeCfg.label}
        </span>
        <span className={styles.cardMeta}>
          {CATEGORY_LABELS[resource.category]}
          {views > 0 ? ` · ${views} consultation${views > 1 ? 's' : ''}` : ''}
        </span>
      </div>

      <div className={styles.cardBody}>
        {isRelevant && (
          <p className={styles.relevantBanner} style={{ marginBottom: 16 }}>
            <strong>Liée à tes tickets actifs</strong>
            {matchingCcps.length > 0
              ? ` — ${matchingCcps.join(', ')}`
              : ' — recommandée pour ton parcours en cours.'}
          </p>
        )}

        <h1 className={styles.cardTitle}>{resource.title}</h1>
        <p className={styles.cardDescription}>{resource.description}</p>

        <div className={styles.chipRow}>
          {resource.ccps.map((ccp) => (
            <span
              key={ccp}
              className={`${styles.chip} ${
                activeCcps.includes(ccp) ? styles.chipAccent : ''
              }`}
            >
              {ccp}
            </span>
          ))}
          {resource.tags.map((tag) => (
            <span key={tag} className={styles.chip}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.primaryAction}
          disabled={!canOpen}
          onClick={() => onOpen(resource)}
        >
          {isComingSoon
            ? 'Contenu bientôt disponible'
            : 'Ouvrir la ressource'}
          {canOpen && <span aria-hidden>↗</span>}
        </button>
      </div>

      <div className={styles.cardFooter}>
        {canOpen
          ? 'S’ouvre dans un nouvel onglet — garde ton lab ouvert pendant la consultation.'
          : 'Ce contenu sera ajouté prochainement au catalogue de formation.'}
      </div>
    </div>
  );
}
