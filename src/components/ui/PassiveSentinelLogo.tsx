import { cn } from "@/lib/utils";

type PassiveSentinelLogoProps = {
  className?: string;
};

/** Inline SVG brand mark — Passive Sentinel (H + perimeter ring). */
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
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="var(--color-ring)"
        strokeWidth="2"
        opacity={0.95}
      />
      <path
        d="M11 11v10M21 11v10M11 16h10"
        stroke="var(--color-foreground)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
