import type { MetadataRoute } from "next";

import {
  ROBOTS_DISALLOW_PREFIXES,
  absoluteUrl,
} from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...ROBOTS_DISALLOW_PREFIXES],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
