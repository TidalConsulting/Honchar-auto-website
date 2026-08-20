/**
 * The site's public base URL, used for canonical links, sitemap entries, and
 * social-share previews. Server-side only.
 *
 * Set NEXT_PUBLIC_SITE_URL once the custom domain is live. Until then this
 * falls back to the URL Vercel assigns the deployment, so previews still
 * generate working links.
 */
/**
 * True only for the real, public site.
 *
 * Test and preview deployments must never be indexed — otherwise sample
 * inventory gets crawled under the dealership's own name and competes with
 * the real listings.
 *
 * On Vercel this resolves automatically: only the production deployment is
 * indexable, every preview URL is not. Anywhere else, set
 * NEXT_PUBLIC_SITE_ENV=test to mark a deployment as non-public.
 */
export function isPublicSite(): boolean {
  if (process.env.NEXT_PUBLIC_SITE_ENV === "test") return false;

  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv === "production";

  return process.env.NODE_ENV === "production";
}

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}
