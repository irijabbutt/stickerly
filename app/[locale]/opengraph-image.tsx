import { ImageResponse } from "next/og";

export const alt = "Stickerly - digital stickers, animated UI and 3D scenes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social platforms (Facebook, X, LinkedIn, WhatsApp) don't render SVG previews,
// so generate a real 1200x630 PNG instead of pointing og:image at logo.svg.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#8b5cf6,#f472b6)",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -4 }}>Stickerly</div>
        <div style={{ fontSize: 40, marginTop: 12, opacity: 0.92 }}>
          Digital stickers - Animated UI - 3D scenes
        </div>
      </div>
    ),
    size,
  );
}
