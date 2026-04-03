import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    // Set the workspace root to this project's directory to silence the
    // "multiple lockfiles" warning from Next.js 16+
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
