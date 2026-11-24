import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  webpack(config) {
    const oneOfRule = config.module.rules.find(
      (rule: Record<string, unknown>) => typeof rule === "object" && rule !== null && Array.isArray(rule.oneOf)
    );
    if (oneOfRule && Array.isArray(oneOfRule.oneOf)) {
      for (const rule of oneOfRule.oneOf) {
        if (rule.use && Array.isArray(rule.use)) {
          const hasCssLoader = rule.use.some(
            (u: { loader?: string }) => typeof u === "object" && u !== null && typeof u.loader === "string" && u.loader.includes("css-loader")
          );
          if (hasCssLoader) {
            rule.use.push({
              loader: "@tailwindcss/turbopack",
            });
          }
        }
      }
    }
    return config;
  },
  async rewrites() {
    const apiTarget = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiTarget}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
