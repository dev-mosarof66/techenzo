import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";

/** Editing UI. Never indexed — see the metadata below and robots.ts. */
export const metadata = {
  title: "Content",
  robots: { index: false, follow: false },
};

export default makePage(config);
