import { DOCS } from '../../docs/data/docsData';
import type { ResourcesSearch } from './resourcesSearch';

export function docsSearch(docId: string): ResourcesSearch {
  return { tab: 'docs', doc: docId };
}

export function catalogSearch(
  resourceId: string,
  filter?: string,
): ResourcesSearch {
  return {
    tab: 'catalog',
    r: resourceId,
    ...(filter ? { filter } : {}),
  };
}

export function docPageTitle(docId: string): string {
  return DOCS.find((d) => d.id === docId)?.title ?? 'Fiche Kyernal';
}
