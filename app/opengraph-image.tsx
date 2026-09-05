import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return renderBrandCard();
}
