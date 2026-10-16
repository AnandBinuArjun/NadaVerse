/**
 * NadaVerse API Configuration
 * Supports production deployments (e.g. Vercel) and local development.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
).replace(/\/$/, '');

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://nadaverse.abarjun.online'
).replace(/\/$/, '');
