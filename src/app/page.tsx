"use client";

import type { ScanResponseBody, Severity } from "@/types/scan";
import { useState, type FormEvent } from "react";

function severityBadgeClasses(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100";
    case "medium":
      return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100";
    case "low":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100";
    default: {
      const _exhaustive: never = severity;
      return _exhaustive;
    }
  }
}

export default function Home() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponseBody | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
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

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Hack LATAM — Recon dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            See what the internet already knows about a domain
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            Start with a domain or URL. We run lightweight public checks (starting
            with certificate transparency) and explain results in plain language.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <label htmlFor="target" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Target domain or URL
          </label>
          <input
            id="target"
            name="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example.com or https://www.example.com"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            autoComplete="off"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !target.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {loading ? "Scanning…" : "Start scan"}
          </button>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </form>

        {result ? (
          <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <h2 className="text-xl font-semibold">Results</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Normalized target:{" "}
                <span className="font-mono text-zinc-900 dark:text-zinc-100">
                  {result.normalizedTarget}
                </span>{" "}
                ({result.inputKind})
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Modules
              </h3>
              <ul className="mt-2 space-y-2">
                {result.modules.map((module) => (
                  <li
                    key={module.name}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800"
                  >
                    <span className="font-mono">{module.name}</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium uppercase text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {module.status}
                    </span>
                    {typeof module.durationMs === "number" ? (
                      <span className="text-zinc-500">{module.durationMs} ms</span>
                    ) : null}
                    {module.errorMessage ? (
                      <span className="text-red-600 dark:text-red-400">
                        {module.errorMessage}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Findings
              </h3>
              {result.findings.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  No findings for this scan yet (some modules may be skipped depending on input).
                </p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {result.findings.map((finding) => {
                    const hostnames =
                      Array.isArray(finding.metadata?.hostnames) &&
                      finding.metadata.hostnames.every((h) => typeof h === "string")
                        ? (finding.metadata.hostnames as string[])
                        : [];
                    const total =
                      typeof finding.metadata?.totalHostnames === "number"
                        ? finding.metadata.totalHostnames
                        : hostnames.length;

                    return (
                      <li
                        key={finding.id}
                        className="rounded-xl border border-zinc-100 p-4 dark:border-zinc-800"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${severityBadgeClasses(
                              finding.severity,
                            )}`}
                          >
                            {finding.severity}
                          </span>
                          <span className="text-xs font-mono text-zinc-500">
                            {finding.module}
                          </span>
                        </div>
                        <h4 className="mt-2 text-lg font-semibold">{finding.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {finding.explanation}
                        </p>
                        {hostnames.length > 0 ? (
                          <div className="mt-3">
                            <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                              Hostnames ({total}
                              {total > hostnames.length ? `, showing ${hostnames.length}` : ""})
                            </p>
                            <ul className="mt-2 max-h-60 overflow-y-auto rounded-lg bg-zinc-50 p-3 font-mono text-xs text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                              {hostnames.map((host) => (
                                <li key={host}>{host}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
