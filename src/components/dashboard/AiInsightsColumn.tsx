"use client";

import type {
  AiInsightsResponseBody,
  AiInsightsTopAction,
} from "@/types/ai-insights";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { AiInsightsSkeleton } from "./AiInsightsSkeleton";

function priorityTone(p: AiInsightsTopAction["priority"]): string {
  switch (p) {
    case "critical":
      return "border-red-200 bg-red-50 text-red-900";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    default: {
      const _n: never = p;
      return _n;
    }
  }
}

const DEFAULT_PANEL_DISCLAIMER =
  "El texto de IA es orientativo. Estas comprobaciones son pasivas e incompletas — verifica los hallazgos en tu entorno.";

export type AiInsightsColumnProps = {
  loading: boolean;
  error: string | null;
  result: AiInsightsResponseBody | null;
  disabled?: boolean;
  servedFromCache?: boolean;
  onGenerate: (opts?: { forceRefresh?: boolean }) => void | Promise<void>;
};

export function AiInsightsColumn({
  loading,
  error,
  result,
  disabled,
  servedFromCache,
  onGenerate,
}: AiInsightsColumnProps) {
  return (
    <Card className="gap-0 border border-border py-4 shadow-sm" aria-label="AI insights">
      <CardContent className="flex flex-col gap-4 p-4 px-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Insights con IA
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen de remediación bajo demanda — sin listas de hostnames por
            defecto.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-start">
          <Button
            type="button"
            disabled={disabled || loading}
            onClick={() => {
              void onGenerate({ forceRefresh: false });
            }}
            size="lg"
            className="min-h-11 cursor-pointer rounded-lg px-4 py-2 text-sm"
          >
            {loading ? "Generando…" : result ? "Actualizar cache" : "Generar"}
          </Button>
          {result ? (
            <Button
              type="button"
              variant="outline"
              disabled={disabled || loading}
              onClick={() => {
                void onGenerate({ forceRefresh: true });
              }}
              title="Ignora la caché de 24h y vuelve a llamar al modelo (consumo de tokens)."
              size="lg"
              className="min-h-11 rounded-lg border-amber-300 bg-amber-50 px-4 py-2 text-amber-900 hover:bg-amber-100 disabled:opacity-45"
            >
              Nueva IA (tokens)
            </Button>
          ) : null}
        </div>
      </div>

      {servedFromCache && result && !loading ? (
        <p className="mt-3 rounded-lg border border-accent/25 bg-accent/5 p-3 text-xs leading-relaxed text-foreground">
          Resultado desde caché global (menos de 24h). Usa{" "}
          <strong className="text-amber-800">Nueva IA (tokens)</strong> si quieres
          recomputar aunque coincida la clave.
        </p>
      ) : null}

      <p className="mt-3 rounded-lg border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
        {DEFAULT_PANEL_DISCLAIMER}
      </p>

      {loading ? (
        <div className="mt-4">
          <AiInsightsSkeleton />
        </div>
      ) : null}

      {error && !loading ? (
        <p
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {result && !loading ? (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Summary
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {result.executiveSummary}
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Prioritized actions
            </h3>
            {result.topActions.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No actions returned — regenerate or review findings manually.
              </p>
            ) : (
              <ol className="mt-2 list-decimal space-y-3 pl-4 text-sm text-foreground">
                {result.topActions.map((action) => (
                  <li
                    key={action.id}
                    className={`rounded-lg border p-3 ${priorityTone(
                      action.priority,
                    )}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {action.priority}
                      </span>
                      <span className="text-xs uppercase text-muted-foreground">
                        confidence: {action.confidence}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-foreground">
                      {action.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {action.why}
                    </p>
                    <p className="mt-2 text-xs font-medium text-foreground">
                      <span className="font-normal text-muted-foreground">Verify: </span>
                      {action.verifyStep}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Limitations &amp; caveats
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
              {result.disclaimers.map((line, idx) => (
                <li key={`${line.slice(0, 48)}-${idx}`}>{line}</li>
              ))}
            </ul>
          </div>

          {result.modelUsed ? (
            <p className="font-mono text-[10px] uppercase text-muted-foreground">
              Model: {result.modelUsed}
            </p>
          ) : null}
        </div>
      ) : null}
      </CardContent>
    </Card>
  );
}
