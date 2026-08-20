import type { MetadataRoute } from "next";

import { isPublicSite, siteUrl } from "@/lib/url";

// Evaluated per request. Prerendering this would bake in whichever answer was
// correct at build time, which is wrong the moment the same build is promoted
// between environments.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  // Test and preview deployments are closed to crawlers entirely, so sample
  // inventory never gets indexed under the dealership's name.
  if (!isPublicSite()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The dashboard and internal endpoints should never be indexed.
        disallow: ["/admin", "/admin/", "/api/", "/saved"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
