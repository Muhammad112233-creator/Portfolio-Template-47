import type { MetadataRoute } from 'next';

import { site } from '@/data/site';

// Required for `output: 'export'` — the route must be statically generated.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
