/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/utils'],

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Enable fast refresh
    reactStrictMode: true,

    // Enable experimental features for better dev experience
    experimental: {
      optimizePackageImports: ['@repo/ui', '@repo/utils'],
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    reactStrictMode: true,
    // compress: true, // Turbopack handles compression automatically
  }),
}

export default nextConfig