import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Fonts are read from the repo, not fetched at build time — a network call here
 * would make the card silently fall back to a system face whenever the build
 * runs offline or Google is slow, and nobody would notice until it was shared.
 * Satori needs TTF/OTF; it cannot parse woff2.
 */
async function fonts() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [sans, mono] = await Promise.all([
    readFile(join(dir, "Geist-Medium.ttf")),
    readFile(join(dir, "GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Geist", data: sans, weight: 500 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

/**
 * The share card, in the site's own language: hairlines, an indexed mono
 * kicker, one accent. Dark only — an OG card has no viewer theme to respect.
 */
export async function renderBrandCard({
  kicker = "Techenzo",
  title = site.tagline,
  description = site.description,
}: {
  kicker?: string;
  title?: string;
  description?: string;
} = {}) {
  // Long experiment titles need a smaller headline or the card overflows.
  const fontSize = title.length > 60 ? 54 : title.length > 38 ? 64 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101215",
          padding: 72,
          fontFamily: "Geist",
        }}
      >
        {/* Masthead */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              boxSizing: "border-box",
              position: "relative",
              width: 44,
              height: 44,
              border: "3px solid #FF5A33",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 9,
                right: 9,
                width: 14,
                height: 14,
                background: "#FF5A33",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 26,
              letterSpacing: 4,
              color: "#F4F5F7",
            }}
          >
            {kicker.toUpperCase()}
          </div>
        </div>

        {/* Thesis */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          <div
            style={{
              display: "flex",
              fontSize,
              lineHeight: 1.05,
              letterSpacing: -2.6,
              color: "#F4F5F7",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.5,
              color: "#AEB4BC",
            }}
          >
            {description}
          </div>
        </div>

        {/* Footer rule */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, background: "#2A2E35" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 24,
              fontFamily: "Geist Mono",
              fontSize: 22,
              color: "#838A94",
            }}
          >
            <div style={{ display: "flex" }}>techenzo.com</div>
            <div style={{ display: "flex", color: "#FF5A33" }}>
              Building · Shipping · Measuring
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
