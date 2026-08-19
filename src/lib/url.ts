/**
 * The site's public base URL, used for canonical links, sitemap entries, and
 * social-share previews. Server-side only.
 *
 * Set NEXT_PUBLIC_SITE_URL once the custom domain is live. Until then this
 * falls back to the URL Vercel assigns the deployment, so previews still
 * generate working links.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}
