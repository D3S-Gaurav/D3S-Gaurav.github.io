import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the site can be served from GitHub Pages.
  output: "export",
  // Emits /about/index.html etc., which GitHub Pages resolves for /about.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
