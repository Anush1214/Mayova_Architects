import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode — GSAP timelines don't survive double-mounting
  reactStrictMode: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [40, 50, 65, 70, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year — images from Sanity are immutable
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // Bundle optimization — tree-shake heavy packages
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
};

export default nextConfig;
