"use client";

import { AssetsColumn } from "@/components/dashboard/AssetsColumn";
import { ChecklistColumn } from "@/components/dashboard/ChecklistColumn";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { RiskColumn } from "@/components/dashboard/RiskColumn";
import { SearchHero } from "@/components/dashboard/SearchHero";
import { SkeletonGrid } from "@/components/dashboard/SkeletonGrid";
import { TopNav } from "@/components/dashboard/TopNav";
import { aggregateHostnamesFromFindings } from "@/lib/dashboard/findings";
import type { ScanResponseBody } from "@/types/scan";
import { useMemo, useState, type FormEvent } from "react";

export default function Home() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponseBody | null>(null);
  const [dashboardMode, setDashboardMode] = useState(false);

  const findingsForGrid = result?.findings ?? [];
  const hostAggregate = useMemo(
    () => aggregateHostnamesFromFindings(findingsForGrid),
    [findingsForGrid],
  );

  function resetToHero() {
    setDashboardMode(false);
    setResult(null);
    setError(null);
    setLoading(false);
  }

  async function runScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    setDashboardMode(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
            ? (body as { error: string }).error
            : `Scan failed (${response.status}).`;
        setError(message);
        return;
      }
      setResult(body as ScanResponseBody);
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  const displayTarget =
    result?.normalizedTarget?.trim() ||
    result?.target?.trim() ||
    target.trim() ||
    "";

  const moduleRows = result?.modules ?? [];

  return (
    <div className="min-h-full bg-slate-950 text-slate-50">
      {dashboardMode ? (
        <TopNav
          target={target}
          onTargetChange={setTarget}
          onSubmit={runScan}
          loading={loading}
          error={error}
          onNewScan={resetToHero}
        />
      ) : null}

      {!dashboardMode ? (
        <main className="mx-auto max-w-5xl">
          <SearchHero
            target={target}
            onTargetChange={setTarget}
            onSubmit={runScan}
            loading={loading}
            error={error}
          />
        </main>
      ) : (
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6">
          {loading ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Scanning
              </p>
              <p className="font-mono text-sm font-medium text-emerald-400 break-all">
                {displayTarget || target.trim() || "—"}
              </p>
              <SkeletonGrid />
            </div>
          ) : (
            <DashboardGrid>
              <AssetsColumn
                displayTarget={displayTarget}
                normalizedTarget={result?.normalizedTarget}
                inputKind={result?.inputKind}
                modules={moduleRows}
                hostnames={hostAggregate.hostnames}
                totalHostnames={hostAggregate.total}
              />
              <RiskColumn findings={findingsForGrid} />
              <ChecklistColumn findings={findingsForGrid} />
            </DashboardGrid>
          )}
        </main>
      )}
    </div>
  );
}
