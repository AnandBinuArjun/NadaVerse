/**
 * NadaVerse API Configuration
 * Supports production deployments (e.g. Vercel), staging previews, and local development.
 * Robustly normalizes API URLs to prevent /api/v1 duplication and localhost leaks in production.
 */

export function resolveApiBaseUrl(rawUrl?: string): string {
  const trimmed = (rawUrl || '').trim();
  if (trimmed) {
    let url = trimmed.replace(/\/+$/, '');
    // Strip trailing /api/v1 or /api to prevent double prefixes from callers
    url = url.replace(/\/api\/v1$/, '').replace(/\/api$/, '');
    return url;
  }

  // Runtime environment check
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.endsWith('.local')) {
      // In production or preview deployments where NEXT_PUBLIC_API_URL was omitted,
      // fallback to the current host origin rather than leaking an unreachable localhost:8000
      return window.location.origin;
    }
  }

  return 'http://localhost:8000';
}

export const API_BASE_URL = resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://nadaverse.abarjun.online'
).replace(/\/+$/, '');
