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
  const baseUrl = (import.meta as any).env?.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
}
