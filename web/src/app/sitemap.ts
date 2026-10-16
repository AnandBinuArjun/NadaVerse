import { MetadataRoute } from 'next';
import { VERIFIED_RAGAS, VERIFIED_TALAS, VERIFIED_INSTRUMENTS, VERIFIED_COMPOSERS } from '../data/carnaticData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadaverse.abarjun.online';
  const now = new Date();

  // Core sections
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?section=practice`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/?section=learn`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?section=explore`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // Ragas: all 72 Melakartas and verified janyas
  const ragaRoutes: MetadataRoute.Sitemap = VERIFIED_RAGAS.map((raga) => ({
    url: `${baseUrl}/?tab=ragas&raga=${raga.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: raga.isMelakarta ? 0.9 : 0.75,
  }));

  // Talas
  const talaRoutes: MetadataRoute.Sitemap = VERIFIED_TALAS.map((tala) => ({
    url: `${baseUrl}/?tab=talas&tala=${tala.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Instruments
  const instrumentRoutes: MetadataRoute.Sitemap = VERIFIED_INSTRUMENTS.map((inst) => ({
    url: `${baseUrl}/?tab=instruments&slug=${inst.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Composers
  const composerRoutes: MetadataRoute.Sitemap = VERIFIED_COMPOSERS.map((comp) => ({
    url: `${baseUrl}/?tab=composers&slug=${comp.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [
    ...coreRoutes,
    ...ragaRoutes,
    ...talaRoutes,
    ...instrumentRoutes,
    ...composerRoutes,
  ];
}
