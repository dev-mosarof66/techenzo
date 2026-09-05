import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { routeByPath } from "@/config/routes";

const route = routeByPath("/contact");

export const alt = route.title;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function TwitterImage() {
  return renderBrandCard({ title: route.title, description: route.description });
}
