/**
 * YouTube thumbnail generator — 1280x720 PNG, the site's language.
 *
 * A thumbnail is judged at 210px wide in a mobile sidebar, not at full size.
 * Every choice here follows from that: at most a few words, type that stays
 * legible when the image is a sixth of its size, one accent, and a number
 * where there is one. The measurement IS the hook for this channel — a
 * thumbnail that leads with a result is on-brand in a way a face is not.
 *
 * Usage:
 *   node scripts/thumbnail.mjs \
 *     --kicker "Experiment 004" \
 *     --title "We cut p95 by 42%" \
 *     --metric "-42%" --label "p95 latency" \
 *     --out thumbnails/exp-004.png
 *
 * --metric/--label are optional; without them the title gets the full width.
 *
 * Twin of lib/og.tsx in spirit, not in code: that renders share cards at
 * request time inside Next, this is a one-off CLI. Both read the same fonts
 * from assets/fonts and the same colours as styles/tokens.css.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import React from "react";
// Node's ESM resolver needs the file extension here; Next's bundler does not.
import { ImageResponse } from "next/og.js";

const h = React.createElement;

const W = 1280;
const H = 720;
const PAD = 76;

// styles/tokens.css — hardcoded for the same reason the brand mark is: a
// thumbnail has no viewer theme to follow.
const BG = "#0a0b0d";
const TEXT = "#f4f5f7";
const MUTED = "#838a94";
const ACCENT = "#FF5A33";
const PANEL = "#16181c";

function args() {
  const out = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    const key = process.argv[i].replace(/^--/, "");
    out[key] = process.argv[i + 1];
  }
  return out;
}

/**
 * Titles are sized down in steps rather than continuously — a handful of
 * predictable sizes keeps a row of thumbnails looking like a set, which is
 * the whole point of a template.
 */
function titleSize(text, wide) {
  const n = text.length;
  if (wide) return n <= 22 ? 132 : n <= 40 ? 108 : n <= 60 ? 88 : 72;
  return n <= 20 ? 108 : n <= 36 ? 88 : n <= 54 ? 72 : 60;
}

const Mark = (size) =>
  h("svg", { width: size, height: size, viewBox: "0 0 32 32" }, [
    h("rect", { key: "a", x: 1.5, y: 1.5, width: 29, height: 29, fill: "#101215", stroke: ACCENT, strokeWidth: 3 }),
    h("rect", { key: "b", x: 15, y: 6, width: 10, height: 10, fill: ACCENT }),
  ]);

async function main() {
  const a = args();
  const kicker = a.kicker ?? "Build log";
  const title = a.title ?? "Set a title with --title";
  const metric = a.metric;
  const label = a.label ?? "";
  const out = a.out ?? "thumbnail.png";

  const fontDir = join(process.cwd(), "assets", "fonts");
  const [sans, mono] = await Promise.all([
    readFile(join(fontDir, "Geist-Medium.ttf")),
    readFile(join(fontDir, "GeistMono-Regular.ttf")),
  ]);

  const wide = !metric;

  const left = h("div", {
    style: {
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      width: wide ? W - PAD * 2 : 720, height: "100%",
    },
  }, [
    // Kicker — which series this belongs to.
    h("div", {
      key: "k",
      style: {
        fontFamily: "Geist Mono", fontSize: 26, letterSpacing: 6,
        color: ACCENT, textTransform: "uppercase",
      },
    }, kicker),

    // Title — the only thing that has to survive being shrunk to 210px wide.
    h("div", {
      key: "t",
      style: {
        display: "flex", fontSize: titleSize(title, wide), color: TEXT,
        lineHeight: 1.08, letterSpacing: -1, marginTop: 24, marginBottom: 24,
      },
    }, title),

    // Footer — the mark earns recognition across a row of thumbnails.
    h("div", { key: "f", style: { display: "flex", alignItems: "center", gap: 16 } }, [
      h("div", { key: "m", style: { display: "flex" } }, Mark(38)),
      h("div", {
        key: "u",
        style: { fontFamily: "Geist Mono", fontSize: 24, color: MUTED, letterSpacing: 1 },
      }, "techenzo.com"),
    ]),
  ]);

  // The number, when there is one. Vertically centred and left of the
  // duration badge, which YouTube stamps over the bottom-right corner.
  const right = metric
    ? h("div", {
        key: "r",
        style: {
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", width: 356, height: 356,
          backgroundColor: PANEL, border: `3px solid ${ACCENT}`,
          marginLeft: 32, marginBottom: 40,
        },
      }, [
        h("div", {
          key: "n",
          style: {
            fontSize: metric.length > 5 ? 88 : metric.length > 3 ? 112 : 132, color: ACCENT,
            lineHeight: 1, letterSpacing: -2,
          },
        }, metric),
        label
          ? h("div", {
              key: "l",
              style: {
                fontFamily: "Geist Mono", fontSize: 24, color: MUTED,
                letterSpacing: 3, marginTop: 20, textTransform: "uppercase",
              },
            }, label)
          : null,
      ])
    : null;

  const tree = h("div", {
    style: {
      width: "100%", height: "100%", display: "flex", alignItems: "center",
      padding: PAD, backgroundColor: BG,
      backgroundImage: "radial-gradient(circle at 22% 40%, #191c21 0%, #0a0b0d 62%)",
      fontFamily: "Geist",
    },
  }, [left, right].filter(Boolean));

  const img = new ImageResponse(tree, {
    width: W, height: H,
    fonts: [
      { name: "Geist", data: sans, weight: 500, style: "normal" },
      { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
    ],
  });

  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await img.arrayBuffer()));
  console.log(`${out} — 1280x720`);
}

await main();
