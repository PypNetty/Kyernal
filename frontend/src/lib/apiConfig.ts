const DEFAULT_API_URL = 'http://127.0.0.1:8080';

export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
  return url.replace(/\/$/, '');
}

export function getWsBaseUrl(): string {
  return getApiBaseUrl().replace(/^http/, 'ws');
}

export function apiUrl(path: string): string {
  return `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}
