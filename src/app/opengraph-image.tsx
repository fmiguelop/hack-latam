import { ImageResponse } from "next/og";

import { PassiveSentinelMarkOg } from "@/lib/brand-mark-og";

export const alt =
  "Hack LATAM — Vigila lo observable: instantáneo pasivo de huella observable para PYMEs.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: `linear-gradient(165deg, ${"#020617"} 0%, ${"#0f172a"} 45%, ${"#020617"} 100%)`,
          position: "relative",
        }}
      >
        {/* subtle radar arcs */}
        <div
          style={{
            position: "absolute",
            right: "-120px",
            top: "-80px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            border: "2px solid rgba(14,165,233,0.12)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "40px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            border: "2px solid rgba(2,132,199,0.14)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 48 }}>
          <PassiveSentinelMarkOg diameter={132} />
          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                lineHeight: 1.05,
              }}
            >
              Hack LATAM
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 600,
                color: "#38bdf8",
                letterSpacing: "-0.02em",
              }}
            >
              Vigila lo observable
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 22,
                fontWeight: 400,
                color: "#94a3b8",
                maxWidth: 820,
                lineHeight: 1.45,
              }}
            >
              Huella observable pasiva — DNS de correo, HTTPS y transparencia de certificados.
              Sin explotación.
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 80,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(148,163,184,0.85)",
          }}
        >
          Superficie externa · PYME · Latinoamérica
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
