import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

/**
 * The site is built as a static export so it can be published to GitHub Pages
 * (or any static host) with `npm run build` -> `out/`.
 *
 * If you are deploying to a project sub-path instead of a custom domain —
 * e.g. https://your-username.github.io/halden-studio/ — set the BASE_PATH
 * repository variable in GitHub to `/halden-studio`. The deploy workflow
 * passes it through automatically.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Pin the tracing root to this project so a stray lockfile in a parent
  // directory cannot change how Next resolves the workspace.
  outputFileTracingRoot: dir,

  // Static export — the build writes a plain `out/` folder.
  output: 'export',

  // The image optimiser needs a server; a static export has none.
  images: { unoptimized: true },

  // GitHub Pages serves directories, so every route needs a trailing slash.
  trailingSlash: true,

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  experimental: {
    optimizePackageImports: ['three'],
  },
};

export default nextConfig;
