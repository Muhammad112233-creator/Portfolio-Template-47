/**
 * Path helpers for deployments that live under a sub-path.
 *
 * When the site is published to a project Pages URL such as
 * `https://your-username.github.io/halden-studio/`, every asset in `public/`
 * has to be prefixed with `/halden-studio`. Next.js handles `<Link href>` and
 * `<Script src>` for you, but it does **not** touch:
 *
 *   - plain `<img src>` / unoptimised `next/image` sources
 *   - `metadata.icons`, `openGraph.images`, `manifest`
 *   - CSS `url()` values
 *
 * so those need this helper. The value comes from `NEXT_PUBLIC_BASE_PATH`
 * because it has to be inlined into the client bundle as well as read by
 * `next.config.mjs`.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefix a root-relative path with the deployment base path. */
export function withBase(path: string): string {
  if (!basePath) return path;
  if (!path.startsWith('/')) return path;
  if (path.startsWith(`${basePath}/`) || path === basePath) return path;
  return `${basePath}${path}`;
}
