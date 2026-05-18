/**
 * Canonical site URLs and SEO constants.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://orbita.example).
 *
 * Domain ownership verification still uses legacy `_hack-latam-*` DNS/file paths
 * for backward compatibility with tokens users already published.
 */

export const SITE_NAME = "Órbita";

export const SITE_TAGLINE = "Vigila lo observable";

/** Root `<title>` when no segment overrides */
export const TITLE_DEFAULT = `${SITE_NAME} — Instantáneo pasivo de huella observable para PYMEs`;

/** Child routes supply `%s`; blog titles use plain headline */
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

/** Default meta description — passive posture, no overclaiming */
export const SITE_DESCRIPTION =
  "Órbita ofrece un instantáneo pasivo de huella observable para PYMEs: correo en DNS público (SPF/DMARC/DKIM), HTTPS en :443 y, en modo profundo, señales vía transparencia de certificados. Sin explotación ni cobertura garantizada; la IA opcional solo orienta sobre los hallazgos.";

/** Locked palette — mirrors semantic tokens in src/app/globals.css */
export const BRAND_COLORS = {
  background: "#020617",
  card: "#0f172a",
  primary: "#0284c7",
  ring: "#0ea5e9",
  accent: "#0369a1",
  foreground: "#f1f5f9",
  mutedForeground: "#94a3b8",
  border: "#334155",
} as const;

export type SiteLocale = "es";

export const SITE_LOCALE: SiteLocale = "es";

export const SITE_KEYWORDS = [
  "ciberseguridad PYME",
  "huella observable",
  "OSINT pasivo",
  "SPF DMARC DKIM",
  "HTTPS TLS",
  "transparencia de certificados",
  "superficie de ataque",
  "Latinoamérica",
] as const;

/** Paths considered non-indexable for robots.txt */
export const ROBOTS_DISALLOW_PREFIXES = [
  "/api/",
  "/sign-in",
  "/sign-up",
] as const;

/**
 * Absolute origin for metadataBase, canonical URLs, and sitemap.
 */
export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    const normalized = raw.replace(/\/+$/, "");
    const withScheme = /^https?:\/\//i.test(normalized)
      ? normalized
      : `https://${normalized}`;
    try {
      return new URL(withScheme);
    } catch {
      /* fall through */
    }
  }
  if (process.env.NODE_ENV === "development") {
    return new URL("http://localhost:3000");
  }
  /* Production builds without env — avoids crashing; set NEXT_PUBLIC_SITE_URL on deploy */
  return new URL("https://localhost");
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, base).href;
}

export function iconUrl(): string {
  return absoluteUrl("/icon");
}

export function appleIconUrl(): string {
  return absoluteUrl("/apple-icon");
}

export function openGraphImageUrl(): string {
  return absoluteUrl("/opengraph-image");
}

export function manifestUrl(): string {
  return absoluteUrl("/manifest.webmanifest");
}
