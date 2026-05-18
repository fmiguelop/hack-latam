import type { Metadata } from "next";

import { ScanAppChrome } from "@/components/scan/ScanAppChrome";
import { ScanWorkspace } from "@/components/scan/ScanWorkspace";
import {
  SITE_NAME,
  absoluteUrl,
  openGraphImageUrl,
} from "@/lib/site-metadata";

const SCAN_TITLE = "Analizar dominio";
const SCAN_DESCRIPTION =
  "Genera un instantáneo pasivo después de definir modo y objetivo autorizado: correo en DNS público y HTTPS observable; modo profundo añade detalle SPF/DMARC, TLS heredados, registros CAA y huella vía CT. No es tiempo real ni vigilancia de intrusos.";

export const metadata: Metadata = {
  title: SCAN_TITLE,
  description: SCAN_DESCRIPTION,
  alternates: {
    canonical: absoluteUrl("/scan"),
  },
  openGraph: {
    url: absoluteUrl("/scan"),
    title: `${SCAN_TITLE} | ${SITE_NAME}`,
    description: SCAN_DESCRIPTION,
    images: [
      {
        url: openGraphImageUrl(),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} · ${SCAN_TITLE}`,
      },
    ],
  },
  twitter: {
    title: `${SCAN_TITLE} | ${SITE_NAME}`,
    description: SCAN_DESCRIPTION,
    images: [openGraphImageUrl()],
  },
};

type PageProps = {
  searchParams: Promise<{ target?: string | string[] }>;
};

export default async function ScanPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const raw = params.target;
  const initialTarget =
    typeof raw === "string"
      ? raw.trim().slice(0, 256)
      : Array.isArray(raw) && raw[0]
        ? String(raw[0]).trim().slice(0, 256)
        : "";
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ScanAppChrome />
      <main className="flex min-h-0 flex-1 flex-col">
        <ScanWorkspace
          key={initialTarget === "" ? "no-target" : initialTarget}
          initialTarget={initialTarget}
        />
      </main>
    </div>
  );
}
