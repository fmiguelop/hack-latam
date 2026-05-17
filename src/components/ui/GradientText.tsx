import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function GradientText({
  children,
  as: Tag = "span",
  className = "",
}: {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={cn("font-semibold text-primary", className)}>{children}</Tag>
  );
}
