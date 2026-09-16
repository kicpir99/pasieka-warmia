/**
 * Utility for resolving static asset URLs from the /public directory.
 * Ensures assets resolve properly both in local development and when deployed
 * under a repository subpath (such as GitHub Pages /pasieka-warmia/).
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // On GitHub Pages domain (or if running under /pasieka-warmia), always guarantee /pasieka-warmia/ prefix
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('github.io') || window.location.pathname.includes('/pasieka-warmia')) {
      return `/pasieka-warmia/${cleanPath}`;
    }
  }

  const baseUrl = (import.meta as any).env?.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
}
