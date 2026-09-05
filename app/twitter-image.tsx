import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { site } from "@/config/site";

/**
 * Declared explicitly rather than relying on the OG card being reused — X reads
 * twitter:image when it is present, and a missing tag is a silent downgrade to
 * a link with no preview.
 */
export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function TwitterImage() {
  return renderBrandCard();
}
