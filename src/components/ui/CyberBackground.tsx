import type { ReactNode } from "react";

export function CyberBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-full bg-background">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
