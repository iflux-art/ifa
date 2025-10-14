/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Next.js 15 recommended experimental features
  experimental: {
    // Enable optimized package imports for better tree shaking
    optimizePackageImports: ["lucide-react"],

    // Enable server actions for React 19 compatibility
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001", "localhost:3002"],
    },
  },

  // Turbopack configuration - let it handle optimizations automatically
  turbopack: {
    resolveAlias: {
      "@": "./src",
    },
  },

  // Basic security and performance settings
  poweredByHeader: false,
};

export default nextConfig;
