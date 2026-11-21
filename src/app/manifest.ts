import type { MetadataRoute } from 'next';

import { withBase } from '@/lib/paths';

// Required for `output: 'export'` — the route must be statically generated.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Halden Studio',
    short_name: 'Halden',
    description:
      'Independent creative and digital studio — websites, brand identity and e-commerce.',
    start_url: withBase('/'),
    display: 'standalone',
    background_color: '#202020',
    theme_color: '#f7c02f',
    icons: [
      { src: withBase('/favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
      { src: withBase('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' },
    ],
  };
}
