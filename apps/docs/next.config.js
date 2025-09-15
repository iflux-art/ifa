/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/utils'],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Enable fast refresh
    reactStrictMode: true,

    // Enable experimental features for better dev experience
    experimental: {
      optimizePackageImports: [],
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    reactStrictMode: true,
    // Turbopack handles compression automatically in Next.js 15+
  }),

  // Enable Turbopack for faster builds
  experimental: {
    // Move turbo config to turbopack
  },

  // Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
