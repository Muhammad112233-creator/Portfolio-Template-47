import type { MetadataRoute } from 'next';

import { projects, site } from '@/data/site';

// Required for `output: 'export'` — the route must be statically generated.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/works`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/studio`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    ...projects.map((p) => ({
      url: `${site.url}/works/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
