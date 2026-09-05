import { ImageResponse } from "next/og";

/**
 * iOS home-screen icon. Generated at build time from the same geometry as
 * app/icon.svg and the header wordmark, so the mark can only drift in one
 * place. Full-bleed ground — iOS masks the corners and does not composite
 * transparency.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#101215",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            boxSizing: "border-box",
            width: 108,
            height: 108,
            border: "8px solid #FF5A33",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 22,
              right: 22,
              width: 36,
              height: 36,
              background: "#FF5A33",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
