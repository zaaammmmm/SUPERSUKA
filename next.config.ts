import type { NextConfig } from "next";

// Layanan eksternal ditangani satu generic gateway: src/app/[service]/[[...path]]/route.ts.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;
