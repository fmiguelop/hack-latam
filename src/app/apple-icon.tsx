import { ImageResponse } from "next/og";

import { PassiveSentinelMarkOg } from "@/lib/brand-mark-og";
import { BRAND_COLORS } from "@/lib/site-metadata";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_COLORS.background,
          borderRadius: 36,
        }}
      >
        <PassiveSentinelMarkOg diameter={132} />
      </div>
    ),
    {
      ...size,
    },
  );
}
