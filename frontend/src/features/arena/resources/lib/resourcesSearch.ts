export type ResourcesTab = 'catalog' | 'docs';

export type ResourcesSearch = {
  tab: ResourcesTab;
  r?: string;
  doc?: string;
  filter?: string;
};

export type ResourcesNavigate = (options: {
  search:
    | ResourcesSearch
    | ((prev: ResourcesSearch) => ResourcesSearch);
}) => void;

export function validateResourcesSearch(
  search: Record<string, unknown>,
): ResourcesSearch {
  const tab: ResourcesTab = search.tab === 'docs' ? 'docs' : 'catalog';
  const r =
    typeof search.r === 'string' && search.r.length > 0 ? search.r : undefined;
  const doc =
    typeof search.doc === 'string' && search.doc.length > 0
      ? search.doc
      : undefined;
  const filter =
    typeof search.filter === 'string' && search.filter.length > 0
      ? search.filter
      : undefined;
  return { tab, r, doc, filter };
}
