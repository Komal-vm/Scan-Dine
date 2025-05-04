import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages:["@repo/ui"],
  reactStrictMode: true,
};

export default nextConfig;
