export const POST_AUTH_HOME = '/home' as const;
export const UNAUTHENTICATED_REDIRECT = '/' as const;

/** Base URL for parsing absolute hrefs into pathnames only. */
const REDIRECT_PARSE_BASE = 'http://local';

function isSafeRelativePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

function normalizeSafeRedirectPath(input: string): string | null {
  if (isSafeRelativePath(input)) return input;

  try {
    const pathname = new URL(input, REDIRECT_PARSE_BASE).pathname;
    return isSafeRelativePath(pathname) ? pathname : null;
  } catch {
    return null;
  }
}

export function parseAuthRedirect(search: Record<string, unknown>): string {
  const redirect = search.redirect;
  if (typeof redirect !== 'string') return POST_AUTH_HOME;
  return normalizeSafeRedirectPath(redirect) ?? POST_AUTH_HOME;
}

export function safeRedirectPath(href: string): string {
  return normalizeSafeRedirectPath(href) ?? POST_AUTH_HOME;
}
