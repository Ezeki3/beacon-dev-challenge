import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "organic-lamp-45qv659jx9gh7rg9-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;