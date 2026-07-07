import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default config;

