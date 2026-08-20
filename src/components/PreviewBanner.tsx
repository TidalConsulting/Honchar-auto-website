import { isPublicSite } from "@/lib/url";

/**
 * Slim marker shown on every non-production deployment, so nobody reviewing
 * the test site mistakes the sample inventory for real stock. Renders nothing
 * on the live site.
 */
export function PreviewBanner() {
  if (isPublicSite()) return null;

  return (
    <div className="bg-amber-brand-500 px-4 py-2 text-center text-sm font-semibold text-white">
      Preview site — vehicles shown are sample data, not real stock. Not visible to search
      engines.
    </div>
  );
}
