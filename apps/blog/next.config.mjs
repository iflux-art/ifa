import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.dava.cc",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Development optimizations
  ...(process.env.NODE_ENV === "development" && {
    // Enable fast refresh
    reactStrictMode: true,
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
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
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

const withMDX = createMDX({
  // Add providerImportSource configuration if needed
  // options: {
  //   providerImportSource: "@mdx-js/react",
  // },
})

export default withMDX(nextConfig)