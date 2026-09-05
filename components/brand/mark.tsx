/**
 * The Techenzo mark — the favicon artwork, used as the logo everywhere.
 *
 * Colours are hardcoded on purpose: the mark does NOT follow the theme. It is
 * the one element that has to look identical in the tab, on the home screen, in
 * a share card and in the header, and a mark that changes colour between
 * contexts stops being an identity.
 *
 * ⚠ Twin of `app/icon.svg` — same geometry, same values. Change both together.
 * `app/apple-icon.tsx` and the card in `lib/og.tsx` redraw it at their own
 * scales and follow the same proportions.
 */
export function BrandMark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        fill="#101215"
        stroke="#FF5A33"
        strokeWidth="3"
      />
      <rect x="15" y="6" width="10" height="10" fill="#FF5A33" />
    </svg>
  );
}
