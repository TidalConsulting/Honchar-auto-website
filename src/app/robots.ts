import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
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
