import type { NextConfig } from "next";

const SISKA_ORIGIN = process.env.SISKA_ORIGIN ?? "https://siska-theta.vercel.app";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Prefix-preserving: SISKA memakai basePath '/siska', jadi upstream
      // hanya melayani path yang diawali /siska (termasuk /siska/_next/...).
      { source: "/siska", destination: `${SISKA_ORIGIN}/siska` },
      { source: "/siska/:path*", destination: `${SISKA_ORIGIN}/siska/:path*` },
    ];
  },
};

export default nextConfig;
