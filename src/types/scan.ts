export type Severity = "critical" | "medium" | "low";

export type ScanModuleStatus = "ok" | "error" | "skipped";

export interface ScanFinding {
  id: string;
  module: string;
  severity: Severity;
  title: string;
  /** Plain-language risk line for SMB-facing dashboard */
  explanation: string;
  /** Optional details for the UI (e.g. host lists) */
  metadata?: Record<string, unknown>;
}

export interface ScanModuleResult {
  name: string;
  status: ScanModuleStatus;
  durationMs?: number;
  errorMessage?: string;
}

export interface ScanResponseBody {
  target: string;
  normalizedTarget: string;
  inputKind: "domain" | "ip" | "unknown";
  findings: ScanFinding[];
  modules: ScanModuleResult[];
}
