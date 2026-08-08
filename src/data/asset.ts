// Prefix a public asset path with the configured base (import.meta.env.BASE_URL)
// so every image/favicon/OG URL keeps resolving when the site is served from a
// subpath (e.g. https://dratifcezairlioglu.com/en/face-uk/).
//
// Vite statically replaces import.meta.env.BASE_URL at build time in both the
// Astro (server) and React (client) bundles, so this is safe everywhere.
//
// asset('/images/foo.webp') → '/en/face-uk/images/foo.webp'  (base '/en/face-uk')
// asset('/images/foo.webp') → '/images/foo.webp'               (base '/')
const BASE = import.meta.env.BASE_URL;

export function asset(path: string): string {
  return `${BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
