# Techenzo — UI/UX Specification (V1)

> Design contract for `techenzo.com`. Every value here is implementation-ready:
> hex, rem, ms, px. Where a number is a computed accessibility result it is
> annotated with the measured ratio. Build the Next.js app against this document;
> if the code and this file disagree, this file is wrong — fix it here first.

**Status:** V1 · **Owner:** Mosarof Hossain · **Last revised:** 2026-09-04

---

## 1. Design position

### 1.1 The one-sentence brief

> Techenzo's site should read like the **lab notebook of a product studio** —
> an engineering publication that happens to sell things it built.

Three reference registers, blended:

| Register | What we take from it |
|---|---|
| Engineering laboratory | Measurement, hairlines, mono labels, indexed sections, honest numbers |
| Technology publication | Editorial typography, generous measure, serif long-form, restraint |
| Product studio | Real screenshots, status, shipped-ness, clear CTAs |

### 1.2 Principles

1. **Evidence over adjectives.** Every claim gets a number, a screenshot, a repo link, or it gets cut.
2. **Hairlines, not boxes.** Structure comes from 1px rules and alignment. No drop shadows on content. No card soup.
3. **Type does the work.** The layout is 90% typography and whitespace. Decoration is the exception, not the system.
4. **One accent, used rarely.** Colour is a signal, not a surface. If everything is accented, nothing is.
5. **Motion clarifies, never performs.** Sub-450ms, opacity + small translate, once. Nothing animates on a loop.
6. **Fast is a design feature.** A section that costs 40KB of JS to look nice does not ship.
7. **The founder is visible, the brand is bigger.** Techenzo speaks; Mosarof signs.

### 1.3 Banned (explicit anti-brief)

```
purple/blue gradient meshes      floating 3D brains / neural nets
neon glow on dark                robot or "AI face" imagery
glassmorphism cards              "Revolutionising the future of..."
generic dashboard mockups        stock photos of people at laptops
animated starfields              typewriter-effect hero text
scroll-jacking                   auto-playing background video
carousel of logos we don't have  fake testimonials / fake metrics
```

If a section can't be made interesting without one of the above, the section is
not interesting. Cut it.

---

## 2. Colour system

Dark is the **default theme**. Light is a first-class, fully-specified alternate
(long-form reading pages especially benefit). The toggle persists in
`localStorage` and respects `prefers-color-scheme` on first visit.

### 2.1 Primitive ramps

**Ink (neutral)** — the entire structural surface of the site.

| Token | Hex | Token | Hex |
|---|---|---|---|
| `ink-950` | `#0A0B0D` | `ink-400` | `#838A94` |
| `ink-900` | `#101215` | `ink-300` | `#AEB4BC` |
| `ink-850` | `#16181C` | `ink-200` | `#D2D6DB` |
| `ink-800` | `#1D2025` | `ink-100` | `#E7E9EC` |
| `ink-700` | `#2A2E35` | `ink-50`  | `#F4F5F7` |
| `ink-600` | `#3D434C` | `paper`   | `#FBFBFA` |
| `ink-500` | `#5A616B` |  |  |

`paper` is deliberately warm (not `#FFFFFF`) — it reads as stock, not as a screen.

**Signal (accent — vermillion)** — the only chromatic brand colour.

| Token | Hex | Use |
|---|---|---|
| `signal-700` | `#94321B` | pressed states, light-theme borders |
| `signal-600` | `#C43A1E` | **light theme accent** — links, filled buttons |
| `signal-500` | `#D9431F` | light theme hover/decoration only (4.25:1 — not for body text) |
| `signal-400` | `#FF5A33` | **dark theme accent** — links, focus ring, tick marks |
| `signal-300` | `#FF8266` | dark theme hover |
| `signal-100` | `#F7B5A3` | tints, chart ramp |
| `signal-50`  | `#FBDCD3` | tints, chart ramp |

### 2.2 Semantic tokens

| Role | Dark | Light |
|---|---|---|
| `--bg` | `#101215` | `#FBFBFA` |
| `--bg-raised` | `#16181C` | `#F4F5F7` |
| `--bg-sunken` | `#0A0B0D` | `#E7E9EC` |
| `--bg-code` | `#0A0B0D` | `#16181C` (code blocks stay dark in both themes) |
| `--text` | `#F4F5F7` | `#101215` |
| `--text-secondary` | `#AEB4BC` | `#3D434C` |
| `--text-muted` | `#838A94` | `#5A616B` |
| `--border` (decorative rules) | `#2A2E35` | `#E7E9EC` |
| `--border-strong` (dividers that carry structure) | `#3D434C` | `#D2D6DB` |
| `--border-control` (inputs, focusable outlines — **must** clear 3:1) | `#5A616B` | `#838A94` |
| `--accent` | `#FF5A33` | `#C43A1E` |
| `--accent-hover` | `#FF8266` | `#D9431F` |
| `--accent-contrast` (text on filled accent) | `#0A0B0D` | `#FFFFFF` |
| `--focus-ring` | `#FF5A33` | `#C43A1E` |
| `--selection-bg` | `#FF5A33` @ 28% | `#C43A1E` @ 16% |

### 2.3 Measured contrast (computed, not estimated)

| Pair | Ratio | Grade |
|---|---|---|
| `--text` on `--bg` (dark) | 17.20:1 | AAA |
| `--text-secondary` on `--bg` (dark) | 8.98:1 | AAA |
| `--text-muted` on `--bg` (dark) | 5.39:1 | AA |
| `--accent` on `--bg` (dark) | 6.04:1 | AA |
| `--text` on `--bg` (light) | 18.12:1 | AAA |
| `--text-secondary` on `--bg` (light) | 9.63:1 | AAA |
| `--text-muted` on `--bg` (light) | 6.04:1 | AA |
| `--accent` `#C43A1E` on `--bg` (light) | 5.11:1 | AA |
| `#FFFFFF` on filled `#C43A1E` button | 5.29:1 | AA |
| `#0A0B0D` on filled `#FF5A33` button | 6.34:1 | AA |
| `--border-control` on `--bg` (dark / light) | 3.00:1 / 3.36:1 | AA non-text |

**Do not substitute `signal-500` `#D9431F` for accent text on light** — it measures
4.25:1 and fails AA for body-size text. It is a decoration-only step.

### 2.4 Status palette (product & experiment state)

Reserved. Never reused as a chart series colour. Always shipped with a text label —
never colour alone.

| State | Dark | Light | Label |
|---|---|---|---|
| `idea` | `#838A94` | `#5A616B` | Idea |
| `building` | `#F0B84E` | `#8A5A0B` | Building |
| `beta` | `#4FBFAE` | `#0C776B` | Beta |
| `launched` | `#4CC77F` | `#1C774A` | Live |
| `archived` | `#818892` | `#656C76` | Archived |

**Measured against the chip's own 10% tint, not against the page.** The original
values were computed against `--bg` and three of them failed once composited
over the tint they actually sit on: `archived` dark measured 2.79:1, and light
`beta`/`launched` landed at 4.39 and 4.49. Corrected values clear 4.5:1 —
lowest is `archived` light at 4.52:1. A token is only as good as the surface it
renders on; check the composite, not the swatch.

### 2.5 Chart palette (Lab benchmarks) — validated

Categorical hues are assigned **in fixed slot order and never cycled**. Colour
follows the entity, never its rank: filtering a series out must not repaint the
survivors.

| Slot | Hue | Dark | Light |
|---|---|---|---|
| 1 | vermillion (brand) | `#EF4F2A` | `#D9431F` |
| 2 | blue | `#3987E5` | `#2A78D6` |
| 3 | aqua | `#199E70` | `#0F8F63` |
| 4 | amber | `#C98500` | `#EDA100` |
| 5 | violet | `#9085E9` | `#4A3AA7` |
| 6 | magenta | `#D55181` | `#E87BA4` |

**Validated caps** (surfaces `#101215` / `#FBFBFA`):

- **Slots 1–3 clear the all-pairs gate in both modes** — worst CVD ΔE 10.7 dark /
  9.9 light; worst normal-vision ΔE 20.9 both. Use these for scatter, bubble, and
  small-multiple forms, where every pair can appear side by side.
- **All six clear the adjacent-pairs gate in both modes** (bars, stacks, lines) —
  worst CVD ΔE 8.4 dark / 14.8 light; worst normal-vision ΔE 19.7 dark / 20.9 light.
- On **light**, slots 4 (`#EDA100`, 2.09:1) and 6 (`#E87BA4`, 2.60:1) sit below 3:1
  against `paper`. The **relief rule applies**: any chart using them ships visible
  direct labels or an accompanying table view. This is not optional.
- Past six series: fold into "Other", facet into small multiples, or cut. Never
  generate a seventh hue.

**Sequential (magnitude / heatmaps)** — single vermillion hue, light → dark:

`#FBDCD3` · `#F9CABC` · `#F7B5A3` · `#F39D85` · `#EF8365` · `#E96A48` · `#DD5330` · `#C74627` · `#B03C21` · `#94321B` · `#7A2915` · `#632010`

**Ordinal** (discrete ordered steps — funnel stages, tiers) uses the wider-gap
5-step subsets, both validated for monotone lightness, ≥0.06 ΔL gaps, and a
light-end that still reads against the surface:

- light: `#F39D85` → `#E96A48` → `#C74627` → `#94321B` → `#632010`
- dark: `#FBDCD3` → `#F7B5A3` → `#EF8365` → `#DD5330` → `#B03C21`

**Diverging** (regression / delta charts): blue `#2A78D6` ↔ vermillion `#D9431F`,
neutral grey midpoint (`#F0EFEC` light / `#383835` dark). Equal steps per arm.

**Chart non-negotiables for the Lab:**

- One y-axis. Never dual-axis. Two measures of different scale → two charts, or index to a common base.
- Grid lines and axes recede: `--border` at 1px; no vertical grid on time series.
- Text (values, labels, legend text) wears text tokens, never the series colour. The colour lives in the swatch beside the label.
- ≥2 series → legend always present; ≤4 series → also directly labelled at the line end.
- Every chart ships a `<details>` table view of the same numbers.
- Bars: 4px rounded data-end anchored to the baseline, 2px surface gap between adjacent bars and stacked segments. Lines: 2px. Markers: ≥8px.
- Hover is default, not a bonus: crosshair + tooltip on line/area, per-mark tooltip on bar/dot.

---

## 3. Typography

### 3.1 Families

| Role | Family | Weights | Why |
|---|---|---|---|
| Interface & display | **Geist Sans** | 400, 500, 600 | Neutral, engineered, excellent at large display sizes; OFL, self-hostable |
| Long-form body | **Newsreader** | 400, 500, 400 italic | Only inside `/writing` and `/lab` article bodies — this is what makes it read as a publication rather than a landing page |
| Data, labels, code | **Geist Mono** | 400, 500 | Kickers, metrics, metadata, code, tables |

Self-host all three via `next/font/local` with `display: swap` and a matched
fallback stack to keep CLS at 0:

```
--font-sans:  "Geist Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
--font-serif: "Newsreader", ui-serif, Georgia, "Times New Roman", serif;
--font-mono:  "Geist Mono", ui-monospace, "SF Mono", "Cascadia Mono", monospace;
```

**Rule:** serif never appears in the interface. Mono never sets a paragraph.
Three families, three jobs, no overlap.

### 3.2 Scale

Fluid between 375px and 1440px viewports. `rem` values assume a 16px root.

| Token | Size | Line height | Tracking | Weight | Used for |
|---|---|---|---|---|---|
| `display-1` | `clamp(2.75rem, 1.55rem + 5.1vw, 5.25rem)` | 0.95 | −0.035em | 500 | Homepage hero only |
| `display-2` | `clamp(2.25rem, 1.55rem + 3.0vw, 3.75rem)` | 1.02 | −0.03em | 500 | Page heroes (`/products`, `/lab`, ...) |
| `h1` | `clamp(2rem, 1.5rem + 2.1vw, 3rem)` | 1.08 | −0.025em | 500 | Article & detail-page titles |
| `h2` | `clamp(1.5rem, 1.25rem + 1.05vw, 2rem)` | 1.15 | −0.02em | 500 | Section headings |
| `h3` | `1.25rem` | 1.3 | −0.01em | 500 | Card titles, sub-sections |
| `h4` | `1.0625rem` | 1.4 | 0 | 500 | Inline sub-heads |
| `body-lg` | `1.125rem` | 1.65 | 0 | 400 | Hero sub-copy, section intros |
| `body` | `1rem` | 1.6 | 0 | 400 | Default UI text |
| `body-sm` | `0.875rem` | 1.55 | 0 | 400 | Card descriptions, meta |
| `caption` | `0.8125rem` | 1.45 | 0 | 400 | Figure captions, footnotes |
| `kicker` | `0.75rem` | 1 | **0.14em** | 500 | Mono, uppercase — section labels |
| `mono-sm` | `0.8125rem` | 1.5 | 0.01em | 400 | Metadata, tags, table cells |
| `metric` | `clamp(2rem, 1.4rem + 2.4vw, 3.25rem)` | 1 | −0.03em | 500 | Mono — benchmark numbers |
| `prose` | `1.1875rem` | **1.75** | 0 | 400 | Serif — article body |
| `prose-lead` | `1.375rem` | 1.55 | −0.01em | 400 | Serif — article standfirst |

### 3.3 Measure & rhythm

- Article prose column: **68ch** (≈720px at `prose` size). Hard cap.
- Marketing paragraph blocks: **62ch**.
- Card descriptions: **3 lines max**, `line-clamp-3`.
- Vertical rhythm inside prose: `p + p` = `1.4em`; `h2` = `2.4em` top / `0.6em` bottom; `h3` = `1.8em` / `0.5em`.

### 3.4 OpenType & details

- `font-feature-settings: "ss01", "cv01";` on sans.
- **Tabular numerals (`tnum`) mandatory** anywhere numbers align or update: metrics, tables, charts, changelog dates.
- Headings: `text-wrap: balance`. Lead paragraphs: `text-wrap: pretty`.
- Hyphenation on in prose at `<768px` only.
- No text smaller than `0.75rem` anywhere.
- Uppercase is reserved for `kicker`. Nothing else is uppercased.

---

## 4. Layout, grid & spacing

### 4.1 Spacing scale (4px base)

`0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160`

Nothing off-scale. If a gap needs 30px, it needs 32.

### 4.2 Containers

| Container | Max width | Use |
|---|---|---|
| `container-prose` | 720px | Article & experiment bodies |
| `container-default` | 1200px | Every standard page section |
| `container-wide` | 1440px | Full-bleed lab plots, product hero imagery |
| `container-bleed` | 100vw | Hairline dividers, the grid field |

Horizontal padding: `20px` <640 · `32px` 640–1023 · `40px` ≥1024.

### 4.3 Grid

12 columns, 24px gutter (16px <768). Common spans:

| Pattern | ≥1024 | 768–1023 | <768 |
|---|---|---|---|
| Section heading block | 12 | 12 | 12 |
| Product card grid | 3 × 4col | 2 × 6col | 1 × 12col |
| Project card grid | 3 × 4col | 2 × 6col | 1 × 12col |
| Lab experiment list | 12 (full-width rows) | 12 | 12 |
| Article index | 8col list + 4col rail | 12 (rail below) | 12 |
| Article body | 7col offset 1 + 3col margin notes | 10col offset 1 | 12 |
| About | 7col text + 5col portrait | 12 stacked | 12 |

### 4.4 Section rhythm

Vertical padding between top-level page sections:

| Viewport | Padding |
|---|---|
| <640 | 64px |
| 640–1023 | 96px |
| ≥1024 | 128px |
| Hero → first section | +32px |

Every section is separated by a **full-bleed 1px `--border` rule**, not by
background colour changes. Background colour changes at most twice per page.

### 4.5 Breakpoints

`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`. Design at 375, 768, 1280.
Minimum supported width: **320px** — no horizontal scroll, ever.

---

## 5. Surface & the hairline system

This is the single most identity-defining decision in the system.

### 5.1 Rules

- **No box shadows on content.** Shadows exist only on floating layers (mobile nav sheet, popovers, toasts): `0 8px 32px rgb(0 0 0 / 0.45)` dark, `0 8px 32px rgb(0 0 0 / 0.10)` light.
- **Radius:** `0` for full-bleed rules and section dividers · `2px` default (buttons, inputs, cards) · `4px` for media/screenshots · `999px` **only** for status chips and tag pills.
- Cards are defined by a 1px `--border` and internal padding, not by a raised background. Hover changes the border colour, never the elevation.
- Maximum two nested bordered surfaces. Three is card soup.

### 5.2 The three signature devices

**(a) Indexed mono kicker** — every top-level section is numbered.

```
03 ── ENGINEERING LAB ─────────────────────────────────────────
```

Rendered as: index in `kicker` size and `--accent` colour, a 24px `--border` rule,
the label in `kicker` size and `--text-muted`, then a rule flexing to the container
edge. The index is content, not decoration — it makes the homepage read as a
document with a table of contents.

**(b) Corner registration ticks** — cards and media frames carry 8px L-shaped
ticks at two opposite corners (top-left, bottom-right) drawn in `--border-strong`.
On hover they animate to `--accent` and extend to 12px over 120ms. Two
absolutely-positioned pseudo-elements — zero JS.

**(c) The grid field** — a 32px × 32px hairline graph-paper background at 3.5%
opacity (`--border`), masked with a radial gradient so it fades toward the edges.
Appears in exactly **three** places: the homepage hero, the Lab index hero, and the
404 page. Everywhere else the background is flat. Rare use is what keeps it a
signature instead of wallpaper.

### 5.3 Imagery

- Product screenshots: real, at 2× DPR, framed in a 1px `--border` with `4px` radius and a 1px `--bg` inset. **No browser-chrome mockups, no perspective tilt, no floating shadows.**
- Every screenshot has a mono caption beneath it in `caption` size, `--text-muted`.
- Aspect ratios: `16:10` product hero, `4:3` feature detail, `1:1` avatars.
- All `next/image` with explicit `width`/`height`, `sizes`, and AVIF+WebP. The above-the-fold hero image is `priority`.
- OG images generated at build time via `next/og` — see §14.

### 5.4 Iconography

- **Lucide**, 1.5px stroke, 16px / 20px / 24px only. Never filled; never coloured except when it is the sole accent inside a status chip (always paired with text).
- An icon-only control requires `aria-label` plus a tooltip.
- Zero illustration. Zero 3D. Zero emoji in product UI (emoji are fine in the changelog).

---

## 6. Motion system

### 6.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | `120ms` | Hover, focus, colour change |
| `--dur-base` | `180ms` | Toggles, chip selection, small reveals |
| `--dur-slow` | `280ms` | Menus, sheets, accordions |
| `--dur-deliberate` | `420ms` | Scroll-reveals, hero entrance |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Things arriving |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Things leaving |

### 6.2 The five permitted patterns

1. **Scroll reveal** — `opacity 0→1`, `translateY 12px→0`, `--dur-deliberate`, `--ease-entrance`. Fires once at 20% intersection. Children stagger at **60ms**, capped at 6 children (the 7th onward shares the 6th's delay).
2. **Hero entrance** — on mount, staggered 80ms across: kicker → headline lines → sub-copy → CTA row → hero media. Total sequence ≤ 700ms.
3. **Hover** — border colour, tick extension, underline draw. `--dur-fast`. Never scale, never lift, never rotate.
4. **Link underline** — `background-size: 0 1px → 100% 1px`, `left` origin, `--dur-base`. Applies to inline prose links and nav links.
5. **Layer transitions** — mobile nav sheet slides from the top with `--dur-slow`; popovers fade + `translateY 4px`.

Everything else is out of scope. No parallax, no scroll-linked scrubbing, no
marquee, no count-up numbers (the one permitted exception: a **single** hero
metric on a product detail page may count up once, ≤600ms, only if the number is
real).

### 6.3 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Scroll reveals must render their **final state** under reduced motion — never
leave content at `opacity: 0`. Implement as a `data-reveal` attribute flipped to
`data-reveal="in"`, with the reduced-motion query forcing `opacity: 1`.

---

## 7. Navigation

### 7.1 Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ▚ TECHENZO          Products  Projects  Lab  Writing  About    ⌥ ↗ ↗ ☾  │
└──────────────────────────────────────────────────────────────────────────┘
```

- Height **64px**, sticky, `z-50`.
- **At scrollY = 0:** transparent background, no border.
- **At scrollY > 8:** `--bg` at 72% opacity + `backdrop-filter: blur(12px) saturate(140%)` + 1px bottom `--border`. Transition `--dur-base`.
- Left: wordmark (`Techenzo`, sans 500, `0.9375rem`, `-0.02em`) preceded by the 16px mark. Links to `/`.
- Centre-left: nav links, `body-sm`, `--text-secondary`. Hover → `--text` + underline draw. **Active route** → `--text` + a persistent 1px `--accent` underline.
- Right: GitHub and X icon links (20px, `--text-muted` → `--text`), then a 1px vertical `--border` divider, then the theme toggle.
- No dropdown menus in V1. Every destination is one click.

### 7.2 Mobile (<1024px)

- Same 64px bar; right side collapses to theme toggle + a 24px menu button.
- Tapping the menu opens a **full-screen sheet** (not a drawer):
  - `--bg` opaque, slides down `--dur-slow` / `--ease-entrance`.
  - Links stacked, `h3` size, 20px vertical rhythm, each preceded by its mono index (`01`–`05`).
  - Bottom of the sheet: social row + a one-line newsletter form.
  - Body scroll locked; focus trapped; `Esc` and route change both close it.
  - Close button top-right, 44×44px hit area.

### 7.3 Footer

Full-bleed top `--border`, `--bg-sunken` background, 64px vertical padding.

```
TECHENZO                    NAVIGATE        LAB             CONNECT
Building real products      Products        Experiments     GitHub
with AI.                    Projects        Benchmarks      X
                            Writing         Changelog       LinkedIn
[ newsletter inline form ]  About                           Email
─────────────────────────────────────────────────────────────────────
© 2026 Techenzo · Built by Mosarof Hossain          RSS  ·  Sitemap
```

- 4 columns ≥1024, 2 columns 640–1023, 1 column stacked <640.
- Column headings in `kicker`. Links in `body-sm` `--text-muted` → `--text`.
- Bottom bar separated by a 1px `--border`, `mono-sm`, `--text-muted`.

### 7.4 Skip link

First focusable element on every page: "Skip to content", visually hidden until
focused, then pinned top-left with `--accent` background and `--accent-contrast`
text.

---

## 8. Component specification

Each component below lists **anatomy → variants → sizes → states → a11y**.
Every interactive element shares the same focus treatment:

```css
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: 2px;
}
```

Never remove it. Never replace it with a colour change alone.

### 8.1 Button

**Anatomy:** `[icon?] label [icon?]`

| Variant | Idle | Hover | Active | Disabled |
|---|---|---|---|---|
| `primary` | `--accent` bg, `--accent-contrast` text | `--accent-hover` bg | `signal-700` bg, `translateY(0)` | 40% opacity, `not-allowed` |
| `secondary` | transparent bg, 1px `--border-control`, `--text` | `--text` border, `--bg-raised` bg | `--bg-sunken` bg | 40% opacity |
| `ghost` | transparent, `--text-secondary` | `--text`, `--bg-raised` bg | `--bg-sunken` | 40% opacity |
| `link` | `--accent`, underline-on-hover | `--accent-hover`, underline drawn | — | 40% opacity |

| Size | Height | Padding-x | Type | Icon |
|---|---|---|---|---|
| `sm` | 32px | 12px | `body-sm` | 16px |
| `md` (default) | 40px | 16px | `body-sm` | 16px |
| `lg` | 48px | 24px | `body` | 20px |

- Radius `2px`. Weight 500. Transition `--dur-fast`.
- **Never scale on hover.** Colour and border only.
- Loading state: label stays, a 14px spinner replaces the leading icon, `aria-busy="true"`, width locked to prevent reflow.
- Minimum touch target 44×44px on touch devices — pad the hit area, not the visual box.
- External links get a 14px `arrow-up-right` trailing icon and `rel="noopener noreferrer"`.

### 8.2 SectionHeader

**Anatomy:** `index` + rule + `label` + flex rule, then `title`, then optional `intro` + optional right-aligned `action`.

```tsx
<SectionHeader
  index="03"
  label="Engineering Lab"
  title="Experiments, benchmarks, and what they actually proved"
  intro="Each experiment ships with a hypothesis, a method, numbers, and the repo."
  action={{ label: "All experiments", href: "/lab" }}
/>
```

- `index` in `kicker`/`--accent`; `label` in `kicker`/`--text-muted`; `title` in `h2`; `intro` in `body-lg`/`--text-secondary`, max 62ch.
- Bottom margin: 32px <768, 48px ≥768.
- The `action` sits baseline-aligned with `title` on ≥768, and drops below `intro` on mobile.

### 8.3 Card (base)

The shared shell for Product, Project, Experiment and Article cards.

- 1px `--border`, radius `2px`, padding 24px (20px <640).
- Corner registration ticks (§5.2b) at top-left and bottom-right.
- Hover: border → `--border-control`, ticks → `--accent` and extend to 12px, title → `--accent`. All `--dur-fast`.
- The **whole card is one link** — an `<a>` covering the card via a `::after` overlay so the visible title carries the accessible name. Secondary links inside a card get `position: relative; z-index: 1`.
- No hover lift, no shadow, no background change.

### 8.4 ProductCard

```
┌ ▛ ────────────────────────────────────┐
│  [ 16:10 screenshot, 4px radius ]     │
│                                       │
│  ● Live            AI · Developer tool│   ← status chip + category, mono-sm
│  Product Name                         │   ← h3
│  One-line tagline that says what it   │   ← body-sm, --text-secondary, 2 lines
│  does for whom.                       │
│                                       │
│  Next.js · Postgres · pgvector        │   ← TechList, mono-sm, --text-muted
│                                    ▟ │
└───────────────────────────────────────┘
```

- Image: `next/image`, `sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"`, `4px` radius, 1px `--border`.
- Featured variant: spans 8 of 12 columns, image moves left at 50%, content right, image aspect `4:3`.
- Empty image → a `--bg-raised` block with the product initial in `display-2` at 8% opacity. Never a broken frame.

### 8.5 ProjectCard

Denser than ProductCard — no image by default.

- Row 1: category chip + year (`mono-sm`).
- Row 2: title (`h3`).
- Row 3: description, 2 lines clamped (`body-sm`).
- Row 4: tech list + repo/demo icon links.
- Hairline mesh: **each card carries `border-b border-r`, the grid container carries `border-t border-l`.** Not `gap-px` over a border-coloured background — that renders a solid block of border colour wherever a partly-filled last row leaves empty grid area. The border-per-cell approach gives the same single hairline between neighbours at any column count.

### 8.6 ExperimentRow

The Lab index is a **list, not a grid** — it should read like a table of results.

```
──────────────────────────────────────────────────────────────────────
 EXP-004   2026-08-12                                          ↗ repo
 Qdrant vs pgvector: retrieval latency at 1M vectors
 Hypothesis — pgvector with HNSW closes the gap under 1M rows.
 p95 42ms → 31ms        recall@10 0.94        RAG  ·  Vector DB
──────────────────────────────────────────────────────────────────────
```

- Full-width rows separated by 1px `--border`; 32px vertical padding.
- ID (`EXP-004`) in `mono-sm` `--accent`; date in `mono-sm` `--text-muted`.
- Title `h3`; hypothesis `body-sm` `--text-secondary`, 1 line clamped.
- **Result strip:** up to 3 headline metrics in `mono-sm` with tabular numerals; the delta arrow (`→`) is `--text-muted`, the improved value is `--text`.
- Hover: row background → `--bg-raised`, a 2px `--accent` bar animates in on the left edge (`scaleY 0→1`, origin bottom, `--dur-base`).

### 8.7 ArticleCard

- `mono-sm` meta line: date · reading time · content type (`Article` / `Build log` / `Experiment`).
- Title `h3`, 2 lines max.
- Description `body-sm` `--text-secondary`, 2 lines max.
- Optional 16:10 thumbnail on the featured (first) item only.
- Type is also indicated by a 1px left border colour: Article `--border-strong`, Build log `--accent`, Experiment slot-3 aqua. **Always paired with the text label** — never colour alone.

### 8.8 StatusChip

- Height 22px, padding 0 8px, radius `999px`, `mono-sm` at `0.75rem`, uppercase off.
- 6px dot in the status colour + label text in the **status colour** (all status colours clear 5:1 — see §2.4).
- Background: status colour at 10% opacity. Border: status colour at 24%.
- `role="status"` only when it updates live; otherwise plain text.

### 8.9 TechList

- Inline `mono-sm` `--text-muted`, separated by ` · `.
- Max 5 visible, then `+N`. The full list is in the item's `title` attribute and rendered in the detail page.
- Not links, not chips, not logos.

### 8.10 MetricBlock

Used on product detail and experiment result sections.

```
 p95 LATENCY          RECALL@10           INDEX BUILD
 31 ms                0.94                4 m 12 s
 ↓ 26% vs baseline    ↑ 0.03              ↓ 38%
```

- Label `kicker` `--text-muted`; value `metric` (mono, tabular); delta `mono-sm`.
- Delta direction colour: improvement uses status `launched`, regression uses `#E66767` dark / `#C0342F` light — **always with an arrow glyph**, never colour alone.
- 3 across ≥768, 2 across 640–767, 1 across <640, separated by 1px `--border`.
- If a metric is not measured, the block does not exist. Never render a placeholder number.

### 8.11 Prose (MDX body)

- `container-prose`, serif `prose` size.
- `h2` gets a mono index prefix auto-numbered from the document outline, plus a hover-revealed `#` anchor link at `-1.5rem` left offset (hidden <1024).
- Inline links: `--accent` with a 1px underline at 0.12em offset, drawn on hover.
- `blockquote`: 2px `--border-strong` left rule, 20px padding-left, italic, `--text-secondary`. No quotation-mark graphics.
- `figure`: full `container-default` width (breaking the prose column), caption `caption` `--text-muted` centred beneath.
- Lists: `1.4em` between items, custom markers in `--text-muted`; ordered lists use mono numerals.
- Footnotes render as a bottom section with a `--border` top rule.

### 8.12 CodeBlock

- `--bg-code` (dark in both themes), 1px `--border`, radius `4px`, 20px padding.
- `Geist Mono` `0.875rem` / 1.65, tab size 2.
- Header strip: filename (`mono-sm` `--text-muted`) left, language tag + copy button right, separated by a 1px `--border`.
- Copy button: ghost `sm`, swaps to a check icon for 1.5s, announces via `aria-live="polite"`.
- Syntax highlighting: **Shiki at build time** (zero client JS). Custom theme mapping — keywords `--accent`, strings slot-3 aqua, comments `--text-muted`, everything else `--text`.
- Horizontal overflow scrolls inside the block. The page never scrolls sideways.
- Line highlighting via a `--accent` 2px left border and 6% accent background.

### 8.13 ResultTable

- Full width of `container-prose`, or `container-default` when >4 columns.
- Header row: `kicker`, `--text-muted`, 1px `--border-strong` bottom.
- Body rows: 1px `--border` bottom, 12px vertical padding, `mono-sm` for numeric cells with tabular numerals, `body-sm` for text cells.
- Numeric columns right-aligned; the winning value per row in `--text` weight 500, others `--text-secondary`.
- Wrapped in `overflow-x: auto` with `-webkit-overflow-scrolling: touch` and a fade mask on the overflowing edge.

### 8.14 Chart

- Rendered server-side to SVG where the data is static (most Lab charts are). Client JS only for the hover layer.
- Palette, marks, legend and table rules per §2.5.
- Fixed aspect via `aspect-ratio`, never a percentage height — this is what keeps CLS at 0.
- Figure caption states the method in one line: *"n=10 runs, p95, warm cache, 1M vectors, m5.large."* A chart without stated conditions does not ship.

### 8.15 NewsletterForm

- Inline variant (footer, article end): single row — email input + `primary sm` button.
- Block variant (dedicated CTA section): stacked, `body-lg` heading + one-line rationale + form + a `caption` privacy line ("One email when something ships. No spam, unsubscribe in one click.").
- Input: 40px height, 1px `--border-control`, `--bg-raised`, radius `2px`, `body-sm`. Focus → `--accent` border + focus ring.
- States: idle → submitting (button spinner, input disabled) → success (form replaced in place by a check icon + "You're in. First issue when the next experiment lands.") → error (1px `#E66767` border + a `body-sm` message below, `role="alert"`).
- Validation on submit, never on keystroke. Never a red border while the user is still typing.
- Honeypot field + a server-side rate limit (§13).

### 8.16 ContactForm

Fields: Name, Email, Subject (select: *Work together · Product question · Something else*), Message (textarea, 6 rows, min 20 chars).

- Labels always visible above the field — no placeholder-as-label.
- Placeholders show format examples only.
- Errors below the field, `body-sm`, `#E66767`/`#C0342F`, with an `alert-circle` icon and `aria-describedby` wiring.
- Success replaces the form with a confirmation block including a mailto fallback.

### 8.17 ThemeToggle

- 32×32px ghost button, `sun`/`moon` icon crossfade over `--dur-base`.
- `aria-label` reflects the **action**: "Switch to light theme".
- Applies `data-theme` on `<html>`; a tiny blocking inline script in `<head>` reads `localStorage` before paint to prevent a flash.
- Third state is *system* — cycle order: system → light → dark → system. Tooltip names the current state.

### 8.18 Pagination / LoadMore

- Lab, Writing and Projects indexes show 12 items, then a `secondary md` "Load more" button (server action, appends, focus moves to the first new item).
- No infinite scroll — it breaks the footer and the back button.

### 8.19 EmptyState

Used when a collection has no items yet (very likely at launch — design for it).

- 1px dashed `--border`, radius `2px`, 48px padding, centred.
- `h3` + one `body-sm` line + optional `secondary sm` action.
- Copy is honest and specific, never apologetic: *"No experiments published yet. The first benchmark lands with the RAG pipeline writeup."*

### 8.20 Toast

- Bottom-right ≥768, bottom-full-width <768. 1px `--border`, `--bg-raised`, the one permitted shadow.
- Auto-dismiss 5s, pause on hover/focus, manual close always available.
- `role="status"` for success, `role="alert"` for errors.

---

## 9. Page specifications

### 9.1 `/` — Homepage

The most important page. Nine blocks, in this order. Total scroll length target:
**≤ 6 viewport heights** at 1280×800.

**00 · Hero** (grid field background)

```
                    ┌ grid field, radial-masked ┐

  ▚ BUILDING · SHIPPING · MEASURING          ← kicker, --accent index dot

  Building real
  products with AI.                          ← display-1, 2 lines forced

  We design, build and ship AI systems — then publish
  how they actually perform.                 ← body-lg, --text-secondary, 56ch

  [ Explore products ]  [ Read the Lab → ]   ← primary lg + secondary lg

  ── 4 shipped · 11 experiments · open source ──   ← mono-sm --text-muted
```

- Height: `min-height: 82vh` ≥1024 (never `100vh` — the next section must peek), `auto` below with 96px vertical padding.
- Headline: exactly two lines at every breakpoint. Set explicit line breaks per breakpoint rather than relying on wrapping.
- The stat strip is real counts pulled from content at build time. If a count is 0, that clause is omitted rather than shown as "0".
- Entrance sequence per §6.2.2.

**01 · What we build** — three columns, hairline-separated, no cards.

Each: 20px icon, `h4` title, 3-line `body-sm` description.
`AI Products` · `Developer Tools` · `Applied Research`. One sentence each, concrete, no adjectives.

**02 · Featured product** — the asymmetric hero card.

- ≥1024: 7col screenshot left / 5col content right. <1024: stacked, image first.
- Content: StatusChip, `h2` name, `body-lg` tagline, then a two-row Problem/Solution block with `kicker` labels, TechList, and `[Try it]` + `[Read the case study]`.
- If no product is launched yet, this section renders the most advanced item with its true status (`Building`) and a `[Follow the build]` CTA. **Never fake a launch.**

**03 · Engineering Lab** — the differentiator; give it room.

- SectionHeader + the 3 most recent ExperimentRows + a full-width `[All experiments →]` row.
- Each row carries its result strip. This is the section that proves the brand.

**04 · Selected projects** — 3-up ProjectCard grid + `[All projects →]`.

**05 · Latest from Techenzo** — 4 ArticleCards, first one featured with a thumbnail; mixed content types with visible type labels.

**06 · Behind Techenzo** — founder block.

- ≥1024: 5col square portrait left, 7col text right.
- `kicker` "Founder", `h2` "Mosarof Hossain", one `body-lg` paragraph (max 3 sentences), a `mono-sm` role line (`Full-stack engineer · AI systems · Product`), then GitHub / X / LinkedIn as `link` buttons.
- Portrait: real photo, 1:1, grayscale at rest, full colour on hover (`--dur-slow`). This is the only decorative image treatment in the system.

**07 · CTA** — `--bg-sunken`, full-bleed, 96px padding.

- `h2` "Follow the build.", one line of rationale, NewsletterForm block variant.

**Footer** per §7.3.

### 9.2 `/products`

- Hero: `display-2` "Products", one `body-lg` line, plus a mono count (`4 products · 1 live`).
- Filter row: status chips (`All · Live · Beta · Building · Idea`) as toggle buttons, left-aligned, horizontally scrollable <640. Filter state lives in the URL (`?status=live`) so it is shareable and server-renderable.
- Grid: 3-up ≥1024 / 2-up 768–1023 / 1-up <768, 24px gap.
- The featured product spans 8 columns as the first cell.
- Empty state per §8.19.

### 9.3 `/products/[slug]`

Order and rationale:

1. **Header** — StatusChip, `h1` name, `body-lg` tagline, meta row (`Started 2026-03 · v1.4 · MIT`), CTA row (`[Try it ↗]` `[GitHub ↗]`).
2. **Hero screenshot** — `container-wide`, 16:10, `priority`.
3. **Problem** — `kicker` label + 2–3 sentences, `container-prose`. Written for the person with the problem, not for investors.
4. **Solution** — same shape, plus a MetricBlock row if numbers exist.
5. **Features** — 2×2 or 3×2 hairline grid: 20px icon, `h4`, 2 lines each. Maximum 6. Six real features beat twelve padded ones.
6. **How it works** — an architecture diagram (inline SVG, theme-aware via `currentColor` and CSS vars — never a PNG) plus 3–5 numbered steps.
7. **Stack** — grouped TechList by layer (Frontend / Backend / Data / AI / Infra), `mono-sm`, hairline-separated rows.
8. **Metrics** — MetricBlock row. Only real numbers. Omit the section entirely if there are none.
9. **Changelog** — the last 5 entries, date + one line each, linking to the full changelog.
10. **CTA** — try it + newsletter.

### 9.4 `/projects` and `/projects/[slug]`

- Index: category filter (`All · AI · SaaS · Developer tool · Experiment`), then the hairline-mesh ProjectCard grid.
- Detail is lighter than a product page: header, optional screenshot, `container-prose` MDX body, stack, repo/demo links, and prev/next project navigation.
- Products are *things people use*; projects are *things we built*. The visual weight difference should be obvious at a glance.

### 9.5 `/lab`

- Hero **with the grid field** (one of the three permitted uses): `display-2` "The Lab", a two-line `body-lg` explaining the format — hypothesis, method, results, repo — and a mono count.
- Filter row: tags (`RAG · Agents · Vector DB · Evaluation · Performance · Cost`), URL-backed.
- ExperimentRow list, 12 per page, newest first.
- Right rail ≥1280 only: "Method" — a 4-step explanation of how experiments are run and why the numbers are trustworthy. Sticky, `mono-sm`.

### 9.6 `/lab/[slug]` — Experiment

The most structured template on the site. Fixed section order, always:

```
 EXP-004 · 2026-08-12 · 9 min read                    [ ↗ Repo ]

 Qdrant vs pgvector: retrieval latency at 1M vectors   ← h1

 ┌ HYPOTHESIS ──────────────────────────────────────┐
 │ pgvector with an HNSW index closes the latency   │  ← callout, --accent left rule
 │ gap with Qdrant below 1M vectors.                │
 └──────────────────────────────────────────────────┘

 01  Problem        ← indexed h2 sections, serif prose body
 02  Method         ← includes an environment table: hardware, versions, dataset, n
 03  Implementation ← code blocks
 04  Results        ← MetricBlock row + Chart + ResultTable
 05  Analysis
 06  What we learned  ← 3–5 bullets, the takeaway a reader can act on
 07  Limitations      ← MANDATORY. An experiment without stated limits is marketing.
 08  Reproduce        ← repo link + exact commands in a CodeBlock
```

- Sticky table of contents in the left margin ≥1280, tracking the active section via `IntersectionObserver`.
- Reading progress: a 2px `--accent` bar at the very top of the viewport, `transform: scaleX()` only.
- A "Method" summary strip pinned under the header on scroll ≥1024: `n=10 · p95 · warm cache · 1M vectors`.
- End of article: author byline, share row, prev/next experiment, newsletter inline form.

### 9.7 `/writing` and `/writing/[slug]`

- Index: type filter (`All · Articles · Build logs · Experiments`), then a hairline-separated ArticleCard **list** (not a grid — it reads as a publication index). Featured first item gets a thumbnail.
- Right rail ≥1280: most-read, tags, newsletter.
- Article page: `container-prose`, `h1`, `prose-lead` standfirst, byline row (avatar 32px, name, date, reading time), optional hero figure, then Prose body.
- Build logs use a compressed variant: date-stamped `h2` entries, tighter rhythm, `body` sans instead of serif (they are notes, not essays).

### 9.8 `/about`

1. `display-2` "Techenzo" + a 3-sentence positioning paragraph, `container-prose`.
2. **What we do** — 3 hairline rows: Products / Research / Writing.
3. **How we work** — 4–6 principles, each `h4` + 2 lines. This is the trust section; write it plainly.
4. **Founder** — the fuller version of the homepage block: portrait, bio (3 short paragraphs), `mono-sm` timeline (year → milestone, hairline rows), links.
5. **Stack we build on** — grouped TechList.
6. CTA: contact + newsletter.

Hierarchy is non-negotiable: **Techenzo is the subject; Mosarof is a section inside it.**

### 9.9 `/contact`

- Two columns ≥1024: 7col ContactForm / 5col direct-contact rail (email, response-time expectation, "what to include", social links).
- One column stacked <1024, form first.
- Response expectation is stated honestly: *"Usually within two days."*

### 9.10 `/404` and `/500`

- Grid field background (third permitted use).
- `display-2` "404 — no route here." plus one `mono-sm` line showing the attempted path.
- Three suggested destinations as hairline rows: Lab, Products, Home.
- `/500`: same shape, plus a mailto link. No stack traces, no humour that outlives its welcome.

---

## 10. Responsive behaviour matrix

| Element | <640 | 640–1023 | ≥1024 |
|---|---|---|---|
| Nav | Bar + full-screen sheet | Bar + sheet | Full inline nav |
| Hero headline | `2.75rem`, 2 lines | fluid, 2 lines | `5.25rem`, 2 lines |
| Hero CTAs | Stacked full-width | Inline | Inline |
| Section padding | 64px | 96px | 128px |
| Product grid | 1-up | 2-up | 3-up |
| Featured product | Stacked, image first | Stacked | 7/5 split |
| Experiment row | Title + 1 metric | Title + 2 metrics | Full row + 3 metrics |
| Article index | List, no thumbnails | List, featured thumbnail | List + right rail |
| Article body | 12col, `1.0625rem` prose | 10col | 7col + margin notes |
| Lab TOC | Hidden | Hidden | Sticky (≥1280) |
| Footer | 1 column | 2 columns | 4 columns |
| MetricBlock | 1-up | 2-up | 3-up |
| Tables | Horizontal scroll + edge fade | Scroll if needed | Full width |

**Touch rules:** every target ≥44×44px; no hover-only affordances (all card
information is visible at rest); filter rows scroll horizontally with momentum and
a fade mask, never wrap into three ragged lines.

---

## 11. Accessibility specification

Target: **WCAG 2.1 AA**, verified — not assumed.

- **Contrast:** every pair in §2.3 is measured. Any new colour pairing must be computed before it ships.
- **Focus:** `:focus-visible` ring on every interactive element (§8). Focus order follows DOM order. Focus is moved deliberately after route change (to `<h1>`), after "Load more" (to the first new item), and into/out of the mobile sheet.
- **Landmarks:** one `<header>`, one `<nav aria-label="Main">`, one `<main id="content">`, one `<footer>`. Article pages add `<article>`; rails use `<aside>`.
- **Headings:** exactly one `h1` per page; no level skipped.
- **Images:** meaningful images get descriptive alt text; decorative frames get `alt=""`. Product screenshots describe what the UI shows, not "screenshot of product".
- **Charts:** never colour-alone. Legend + direct labels + a `<details>` table view.
- **Status:** never colour-alone. Dot + text label.
- **Motion:** §6.3, with reveals resolving to their final state.
- **Forms:** visible labels, programmatic error association, `aria-live` for async results, no timeouts.
- **Keyboard:** every flow completable without a mouse — including the theme toggle, filters, copy buttons and the mobile sheet.
- **Zoom:** usable at 200% zoom and at 320px width with no horizontal scroll and no clipped content.
- **Forced colors:** `@media (forced-colors: active)` — borders switch to `CanvasText`, the accent to `LinkText`, chart marks gain texture patterns.

**Ship gate:** axe-core clean, keyboard walkthrough of every page, VoiceOver pass on
homepage + one experiment + the contact form, and a Lighthouse a11y score of 100.

### 11.1 Audit results (production build)

axe-core 4.10.2 across `/`, `/about`, `/contact`, `/lab`, `/products`,
`/projects`, `/writing`, a filtered view, and `/404` — **0 violations**. Fixed
during the pass:

- **Heading order.** Index pages ran `h1 → h3`, skipping a level, because the
  page heading was followed straight by card titles. Each collection now carries
  an `sr-only h2`, and `SectionHeader` promotes its kicker label to `h2` when the
  section has no title — the label *is* the section's heading in that case, not
  decoration.
- **Landmark nesting.** The Lab and Writing rails used `<aside>` inside `<main>`,
  which claims a page-level complementary landmark. They are supporting content
  within a section, so they are plain `<div>`s now. (The hypothesis `<aside>` on
  an experiment page is correct — an `aside` scoped inside `<article>` is not a
  page-level landmark.)
- **Contrast on rendered composites.** See §2.4, plus the Shiki comment colour
  (3.15:1 → 4.67:1), the code-strip language label (3.15:1 → 5.65:1), and the
  `accent/70` section indices (3.46/3.12:1 → full accent at 6.04/5.11:1).

**One accepted exception.** The placeholder initials shown in an empty portrait
or product frame render at 8% opacity and axe reports them as low contrast. They
are pure decoration under WCAG 1.4.3, are `aria-hidden`, and are marked
`select-none`. Raising them to 4.5:1 would require ~50% opacity, turning a
watermark into a headline. Kept deliberately, recorded here rather than
suppressed silently.

---

## 12. UX copy rules

- **Voice:** precise, first-person plural, no hype. "We built X. Here's what it measured." Short sentences. Numbers over adjectives.
- **Sentence case everywhere** except the `kicker`.
- **CTA labels** name the outcome, not the mechanism: `Try it` / `Read the case study` / `See the benchmark` / `Follow the build`. Never `Learn more`, `Click here`, `Get started` (started at what?), or `Submit`.
- **Empty states** state the fact and what will change it. Never apologise.
- **Errors** say what happened, why, and the next step: *"Couldn't send that. The message service is down — email hello@techenzo.com and it'll get through."*
- **Never write** "revolutionary", "cutting-edge", "seamless", "leverage", "unlock", "game-changing", "powered by AI" as a standalone claim.
- **Dates:** `2026-08-12` in mono metadata; "12 August 2026" in prose.
- **Numbers:** always with units and always with conditions nearby.

---

## 13. Security & integrity of the public surface

Only two public write endpoints exist in V1, and both are hardened:

- `POST /api/newsletter` and `POST /api/contact`: zod-validated body, honeypot field, timestamp check (reject <2s form fill), IP + fingerprint rate limit (5/hour), Turnstile or equivalent only if abuse actually appears — not preemptively.
- MDX is authored in-repo, not user-supplied: `rehype-sanitize` is still applied, and raw HTML in MDX is disallowed by lint.
- No secrets in the client bundle. All provider keys server-only. A CI check greps the build output for known key prefixes.
- **CSP with a per-request nonce** — implemented in `middleware.ts`. `script-src 'self' 'nonce-…' 'strict-dynamic'`, no `unsafe-inline`. The theme script and the JSON-LD blocks carry the nonce; Next reads it back out of the header and applies it to its own bootstrap and RSC scripts.
- `style-src` keeps `'unsafe-inline'`. Inline **style attributes** cannot carry a nonce and components set status colours that way. It is the one relaxation, and a far smaller surface than an inline-script allowance.
- Also set: `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests`, plus `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and HSTS.

**The cost, measured.** A nonce must be unique per response, so **every HTML route
became dynamic** — `/`, `/about`, `/contact` and the four indexes went from `○`
static to `ƒ` server-rendered. Full-page CDN caching is gone. Render is cheap
(file-based content, no database) but this is a real trade against §15, and it is
inherent to the App Router: Next streams the RSC payload through inline scripts,
so a strict `script-src` needs either a nonce or `'unsafe-inline'`.

**Decided: keep the nonce.** The alternative — every other directive kept, with
`script-src 'self' 'unsafe-inline'` — would restore SSG and is materially weaker,
since an injected inline script would execute. It was considered and rejected.
Do not drift into it later without revisiting this paragraph.

**Follow-on required by that decision.** Dynamic rendering means the content
loaders run per request rather than once at build. Measured at ~1.5ms per MDX
file: with 65 experiments, `/lab` spent 104ms in the loader before sending a
byte. `lib/content-cache.ts` memoises each collection in production — content is
immutable within a deployment — bringing the same page to **11ms warm** (9×).
Development stays uncached so editing a file still shows up on reload.

**Verified in the browser** against a production build: policy header present and
correctly formed, nonce rotates per request, no `unsafe-inline` in `script-src`,
zero console violations, hydration and the theme toggle working, and enforcement
confirmed by `connect-src` and `img-src` both firing `securitypolicyviolation`
on external origins.
- All outbound links `rel="noopener noreferrer"`.

---

## 14. Asset requirements

| Asset | Spec |
|---|---|
| Mark | SVG, square, legible at 16px. **Fixed colours — the mark does not follow the theme** (`#101215` ground, `#FF5A33` border and fill). It is the same artwork in the tab, the header, the footer, the mobile sheet, the home-screen icon and the share card; a mark that changes between contexts stops being an identity. Canonical geometry lives in `components/brand/mark.tsx`, twinned with `app/icon.svg`. |
| Wordmark lockup | Mark + "TECHENZO" set in Geist 500. The *text* inherits `currentColor` so it stays legible on either ground; the mark does not. |
| Favicon | `icon.svg` + `apple-icon.png` 180×180 + `icon.png` 512×512 |
| OG default | 1200×630, generated by `next/og`: dark `#101215`, grid field, wordmark, `display-2` title, mono kicker |
| OG per content | Same template, title + type label + date injected per route |
| Product screenshots | 2× DPR, 2400×1500 source, AVIF + WebP |
| Portrait | 1200×1200, grayscale + colour variants generated at build |

Every route exports `generateMetadata` with title, description, canonical,
OpenGraph and Twitter card. JSON-LD: `Organization` on `/`, `Person` on `/about`,
`SoftwareApplication` on product pages, `Article` on writing and lab pages.

---

## 15. Performance budget

| Metric | Budget |
|---|---|
| LCP | < 2.0s (target), 2.5s hard cap |
| CLS | < 0.05 |
| INP | < 200ms |
| First-load JS — framework floor | ~114KB gzipped (React 19 + Next 16 App Router) |
| First-load JS — **our code on top** | **< 40KB gzipped** · measured 28KB |
| Per-route JS added | < 25KB gzipped |
| CSS | < 15KB gzipped · measured 10.9KB |
| Fonts | 3 families, ≤6 files, ≤180KB total · measured 4 files, 171KB |
| Images above the fold | 1, `priority`, ≤120KB |

**Correction.** This table originally set a `< 90KB` first-load JS budget. That
number was written before anything was measured and is **unachievable on this
stack** — React 19 plus the Next 16 App Router runtime is ~114KB gzipped before
a line of our own code loads. Total measured first load is 142KB.

Budgeting our own code separately is the honest version: it is the part we
control, and 28KB across six client components (theme toggle, mobile sheet,
code copy, reading progress, and two forms) is the number to defend. Revisit the
floor if the framework changes; do not revisit it by pretending.

**Enforcement:** Server Components by default; `"use client"` only for
ThemeToggle, the mobile sheet, filter controls, copy buttons, chart hover layers
and forms. Shiki, MDX and charts render at build time. Reveal animations use CSS +
`IntersectionObserver`, not a motion library — reach for `motion` only if a
component genuinely needs orchestration, and import it dynamically.

---

## 16. Implementation mapping (Tailwind v4)

Tailwind v4 is CSS-first — there is no `tailwind.config.ts`. `styles/tokens.css`
holds the raw tokens; `app/globals.css` imports it and maps what needs to become
a utility.

**Colours** are mapped through `@theme inline`, which makes each utility emit
`var(--x)` rather than a resolved literal — so a theme switch repaints without
regenerating a single class:

```css
@theme inline {
  --color-canvas: var(--bg);
  --color-ink:    var(--text);
  --color-ink-2:  var(--text-secondary);
  --color-ink-3:  var(--text-muted);
  --color-line:   var(--border);
  --color-accent: var(--accent);
  /* + status and chart series */
}
```

Giving `bg-canvas`, `text-ink-2`, `border-line`, `bg-series-1`, and so on.

**The type scale** is *not* mapped into the `--text-*` namespace. Each step
carries size, leading, tracking and weight together, and a size-only utility
would drop three of the four. They are `@utility` text styles instead:
`t-display-1`, `t-h2`, `t-kicker`, `t-metric`, `t-prose`.

**Radius, fonts and motion need no mapping at all.** tokens.css declares them in
an unlayered `:root`, which beats Tailwind's `@layer theme` defaults — and
because v4 utilities reference the theme variable rather than inlining a value,
`rounded-sm` resolves to our 2px, `rounded-md` to our 4px, and `font-mono` to
Geist Mono for free. Durations and easings are read directly:
`duration-[var(--dur-fast)]`, `ease-[var(--ease-entrance)]`.

Never write a raw hex in a component. If a value isn't in the token file, it
doesn't exist yet — add it there first.

## 17. Build order

Design the system before the pages; build the pages before the content.

1. Tokens, fonts, `globals.css`, theme toggle + no-flash script.
2. Layout primitives: Container, Section, SectionHeader, hairline Divider, grid field.
3. Navbar + mobile sheet + Footer + skip link.
4. Button, StatusChip, TechList, Card base + registration ticks.
5. Homepage with hard-coded content — validate the system at full scale before wiring MDX.
6. MDX pipeline: content loaders, frontmatter types (per §11 of the HLD), Shiki, Prose styles.
7. `/lab` + `/lab/[slug]` — the differentiator ships second, not last.
8. `/products`, `/products/[slug]`.
9. `/writing`, `/projects`, `/about`, `/contact`.
10. SEO, OG generation, sitemap, robots, JSON-LD, RSS.
11. Newsletter + contact endpoints with validation and rate limits.
12. Accessibility pass, performance pass, 404/500, analytics events.

**V1 done means:** every page renders with real content, Lighthouse ≥95 across the
board with a11y at 100, and at least one real experiment published in the Lab. A
Lab with no experiments is worse than no Lab.
