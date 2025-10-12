/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Enable Next.js 15 features and optimizations
  experimental: {
    // Enable optimized package imports for better tree shaking
    optimizePackageImports: [
      "@repo/ui",
      "@repo/utils",
      "@repo/types",
      "@repo/config",
      "lucide-react",
      "@radix-ui/react-icons",
    ],
    
    // Enable server actions for React 19 compatibility
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001", "localhost:3002"],
    },
  },

  // Turbopack configuration with advanced optimizations
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.md": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
    resolveAlias: {
      "@": "./src",
      "@/components": "./src/components",
      "@/lib": "./src/lib",
      "@/utils": "./src/utils",
      "@/hooks": "./src/hooks",
      "@/stores": "./src/stores",
      "@/types": "./src/types",
      "@/config": "./src/config",
    },
    resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Advanced webpack optimizations for production
  webpack: (config, { dev, isServer, webpack }) => {
    // Enable React Compiler babel plugin
    if (!dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        })
      );
    }

    if (!dev && !isServer) {
      // Optimize bundle splitting with advanced strategies
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          ui: {
            test: /[\\/]packages[\\/]ui[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 15,
          },
          utils: {
            test: /[\\/]packages[\\/](utils|types|config)[\\/]/,
            name: 'shared',
            chunks: 'all',
            priority: 12,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
      
      // Enable advanced optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    
    return config;
  },
};

export default nextConfig;