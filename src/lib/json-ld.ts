import type { BlogPost } from "@/data/blog-posts";

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  iconUrl,
} from "@/lib/site-metadata";

export function websiteOrganizationJsonLd() {
  const root = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${root}#website`,
        url: root,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "es",
        publisher: { "@id": `${root}#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${root}#organization`,
        name: SITE_NAME,
        url: root,
        logo: {
          "@type": "ImageObject",
          url: iconUrl(),
        },
      },
    ],
  };
}

export function blogPostingJsonLd(post: BlogPost, slug: string) {
  const pageUrl = absoluteUrl(`/blog/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: iconUrl(),
      },
    },
    image: [post.coverImage],
    keywords: post.tags.join(", "),
    articleSection: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
    inLanguage: "es",
  };
}
