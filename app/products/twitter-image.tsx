import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { routeByPath } from "@/config/routes";

/**
 * Per-route share card. Declared explicitly rather than inherited from the root
 * segment: a page that sets its own `openGraph` in metadata drops the inherited
 * file-based image, which ships a link with no preview.
 */
const route = routeByPath("/products");

export const alt = route.title;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function TwitterImage() {
  return renderBrandCard({ title: route.title, description: route.description });
}
