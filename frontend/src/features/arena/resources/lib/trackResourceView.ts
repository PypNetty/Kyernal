const STORAGE_KEY = 'klixy_resource_views';

export function readResourceViews(): Record<string, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Record<string, number>;
  } catch {
    // ignore storage errors
  }
  return {};
}

export function trackResourceView(
  resourceId: string,
  views: Record<string, number>,
): Record<string, number> {
  const updated = { ...views, [resourceId]: (views[resourceId] ?? 0) + 1 };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
  return updated;
}

export function openResourceUrl(url: string): void {
  window.open(url, '_blank');
}
