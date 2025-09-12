/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Turbopack configuration for SVG handling
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['www.google.com', 'favicon.yandex.net', 'icons.duckduckgo.com'],
  },
  // Enable React Strict Mode
  reactStrictMode: true,
}

export default nextConfig