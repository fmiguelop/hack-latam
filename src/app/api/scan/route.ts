import { classifyAndNormalizeTarget } from "@/lib/recon/normalize-target";
import { enumerateSubdomainsFromCrtSh } from "@/lib/recon/subdomains";
import type { ScanModuleResult, ScanResponseBody } from "@/types/scan";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const target =
    typeof body === "object" &&
    body !== null &&
    "target" in body &&
    typeof (body as { target: unknown }).target === "string"
      ? (body as { target: string }).target
      : "";

  const { kind, normalized } = classifyAndNormalizeTarget(target);
  if (!normalized || kind === "unknown") {
    return NextResponse.json(
      {
        error:
          "Enter a domain name or URL (for example example.com or https://example.com).",
      },
      { status: 400 },
    );
  }

  const modules: ScanModuleResult[] = [];
  const findings: ScanResponseBody["findings"] = [];

  if (kind === "ip") {
    modules.push({
      name: "subdomain_enum",
      status: "skipped",
      errorMessage:
        "Subdomain discovery via certificate transparency needs a domain name, not a raw IP address.",
    });
  } else {
    const started = Date.now();
    try {
      const subFindings = await enumerateSubdomainsFromCrtSh(normalized);
      findings.push(...subFindings);
      modules.push({
        name: "subdomain_enum",
        status: "ok",
        durationMs: Date.now() - started,
      });
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Subdomain enumeration failed.";
      modules.push({
        name: "subdomain_enum",
        status: "error",
        durationMs: Date.now() - started,
        errorMessage: message,
      });
    }
  }

  const payload: ScanResponseBody = {
    target,
    normalizedTarget: normalized,
    inputKind: kind,
    findings,
    modules,
  };

  return NextResponse.json(payload);
}
