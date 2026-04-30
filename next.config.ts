import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode — GSAP timelines and Three.js don't survive double-mounting
  reactStrictMode: false,

  // Transpile Three.js packages for compatibility
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 80, 85, 90, 95],
  },

  // Enable Turbopack (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
