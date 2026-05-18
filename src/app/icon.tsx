import { ImageResponse } from "next/og";

import { PassiveSentinelMarkOg } from "@/lib/brand-mark-og";
import { BRAND_COLORS } from "@/lib/site-metadata";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <PassiveSentinelMarkOg diameter={26} />
      </div>
    ),
    {
      ...size,
    },
  );
}
