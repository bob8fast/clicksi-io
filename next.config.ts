import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Optimize worker threads and memory usage
    workerThreads: false,
    cpus: 1,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack for better memory management
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Limit parallel processing to prevent worker issues
    config.parallelism = 1;

    return config;
  },
};

export default nextConfig;
