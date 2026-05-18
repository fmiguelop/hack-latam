import { cn } from "@/lib/utils";

type PassiveSentinelLogoProps = {
  className?: string;
};

/** Inline SVG brand mark — Órbita (O monogram + perimeter ring + orbit accent). */
export function PassiveSentinelLogo({ className }: PassiveSentinelLogoProps) {
  return (
    <svg
      className={cn("size-full shrink-0", className)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="7"
        className="stroke-border fill-muted"
        strokeWidth="1"
      />
      {/* Observability ring */}
      <circle
        cx="16"
        cy="16"
        r="10"
        fill="none"
        stroke="var(--color-ring)"
        strokeWidth="2"
        opacity={0.95}
      />
      {/* Letter O */}
      <circle
        cx="16"
        cy="16"
        r="6"
        fill="none"
        stroke="var(--color-foreground)"
        strokeWidth="2.2"
      />
      {/* Satellite accent — órbita */}
      <circle cx="22.5" cy="11.25" r="2" className="fill-primary" />
    </svg>
  );
}
