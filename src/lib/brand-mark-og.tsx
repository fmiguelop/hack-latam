import { BRAND_COLORS } from "@/lib/site-metadata";

/**
 * Brand mark for next/og ImageResponse — shield tile, radar ring, O monogram (+ orbit dot when space allows).
 * Uses flex-compatible layouts only (Satori subset).
 */
export function PassiveSentinelMarkOg({
  diameter,
}: {
  diameter: number;
}) {
  const pad = Math.max(2, Math.round(diameter * 0.1));
  const outerSide = diameter - pad * 2;
  const ring = Math.max(2, Math.round(outerSide * 0.06));
  const innerClear = outerSide - ring * 2;

  const oSize = Math.max(
    8,
    Math.round(innerClear * 0.58),
  );
  const oBorder = Math.max(2, Math.round(oSize * 0.2));

  const showSatellite = diameter >= 44;
  const dotSize = showSatellite
    ? Math.max(3, Math.round(diameter * 0.095))
    : 0;
  const orbitR = oSize / 2 + oBorder / 2 + dotSize * 0.28;
  const angle = (-42 * Math.PI) / 180;
  const dotLeft =
    outerSide / 2 + orbitR * Math.cos(angle) - dotSize / 2;
  const dotTop =
    outerSide / 2 + orbitR * Math.sin(angle) - dotSize / 2;

  return (
    <div
      style={{
        width: diameter,
        height: diameter,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: diameter * 0.22,
        background: BRAND_COLORS.card,
        border: `${Math.max(1, Math.round(ring / 3))}px solid ${BRAND_COLORS.border}`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: outerSide,
          height: outerSide,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "50%",
          border: `${ring}px solid ${BRAND_COLORS.ring}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: oSize,
            height: oSize,
            borderRadius: "50%",
            border: `${oBorder}px solid ${BRAND_COLORS.foreground}`,
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        />
        {showSatellite ? (
          <div
            style={{
              position: "absolute",
              left: dotLeft,
              top: dotTop,
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: BRAND_COLORS.primary,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
