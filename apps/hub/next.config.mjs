/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode for better development experience
  reactStrictMode: true,

  // Image configuration for external sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // Next.js 15 recommended experimental features
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],

    // Server actions configuration for Clerk integration
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001", "localhost:3002"],
    },
  },

  // Basic performance optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
