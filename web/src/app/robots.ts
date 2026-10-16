import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadaverse.abarjun.online';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/v1/auth/', '/api/v1/practice/sessions/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
