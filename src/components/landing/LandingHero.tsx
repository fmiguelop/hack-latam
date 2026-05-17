import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { GradientText } from "@/components/ui/GradientText";
import { cn } from "@/lib/utils";

export function LandingHero() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <Badge
        variant="outline"
        className="inline-flex rounded-full border-border bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground shadow-none hover:bg-muted"
      >
        Cyber Twin Protocol
      </Badge>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Detección de amenazas{" "}
        <GradientText as="span" className="block sm:inline">
          en tiempo real
        </GradientText>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        Visualiza la superficie de ataque de tu dominio con reconocimiento pasivo:
        subdominios, email auth, TLS e insights con IA — explicado para equipos sin
        especialista en seguridad.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/scan"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex min-h-12 rounded-xl px-8 text-sm",
          )}
        >
          Iniciar escaneo →
        </Link>
        <Link
          href="/scan"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "inline-flex min-h-12 rounded-xl border-border px-8 text-sm font-medium text-foreground hover:bg-muted",
          )}
        >
          Ver panel
        </Link>
      </div>
    </section>
  );
}
