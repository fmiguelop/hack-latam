export type TargetInputKind = "domain" | "ip" | "unknown";

export interface ClassifiedTarget {
  kind: TargetInputKind;
  normalized: string;
}

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;
const DOMAINISH = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;

/**
 * Normalize user input (domain, URL, or bare hostname) for recon modules.
 */
export function classifyAndNormalizeTarget(raw: string): ClassifiedTarget {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { kind: "unknown", normalized: "" };
  }

  let host = trimmed;
  if (trimmed.includes("://")) {
    try {
      host = new URL(trimmed).hostname;
    } catch {
      return { kind: "unknown", normalized: trimmed };
    }
  } else {
    host = trimmed.split("/")[0] ?? trimmed;
    host = host.split(":")[0] ?? host;
  }

  host = host.trim();

  if (IPV4.test(host)) {
    return { kind: "ip", normalized: host };
  }

  host = host.toLowerCase().replace(/^www\./, "");
  if (!DOMAINISH.test(host)) {
    return { kind: "unknown", normalized: host };
  }

  return { kind: "domain", normalized: host };
}
