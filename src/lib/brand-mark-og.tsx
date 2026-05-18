import { BRAND_COLORS } from "@/lib/site-metadata";

/**
 * Passive Sentinel mark for next/og ImageResponse — shield tile, radar ring, H monogram.
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
  const innerBox = outerSide - ring * 2;

  const letterScale = 0.52;
  const letterW = Math.round(innerBox * letterScale);
  const letterH = Math.round(innerBox * 0.58);
  const bar = Math.max(2, Math.round(letterW * 0.22));
  const bridgeTop = Math.round(letterH * 0.36 - bar / 2);

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
          borderRadius: "50%",
          border: `${ring}px solid ${BRAND_COLORS.ring}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            width: letterW,
            height: letterH,
            display: "flex",
          }}
        >
          {/* H — left stem */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: bar,
              height: letterH,
              borderRadius: bar / 2,
              background: BRAND_COLORS.foreground,
            }}
          />
          {/* H — right stem */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: bar,
              height: letterH,
              borderRadius: bar / 2,
              background: BRAND_COLORS.foreground,
            }}
          />
          {/* H — bridge */}
          <div
            style={{
              position: "absolute",
              left: bar,
              top: bridgeTop,
              width: letterW - bar * 2,
              height: bar,
              borderRadius: bar / 2,
              background: BRAND_COLORS.foreground,
            }}
          />
        </div>
      </div>
    </div>
  );
}
