import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Spec §5.3 — every image ships AVIF + WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
