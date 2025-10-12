/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // For a navigation site, we allow images from any external source
    // Using remotePatterns to match any domain with https protocol
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
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],

    // Enable server actions for React 19 compatibility
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:3001", "localhost:3002"],
    },

    // Enable optimized CSS loading
    optimizeCss: true,

    // Enable advanced code splitting
    esmExternals: true,

    // Enable React Compiler for better optimization (disabled - may not be available)
    // reactCompiler: true,

    // Enable optimized loading for better performance (disabled - may not be available)
    // optimizeServerReact: true,

    // Enable partial prerendering for better performance (disabled - requires canary)
    // ppr: true,
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
          __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
        })
      );
    }

    // Add bundle optimizer plugin (disabled for now due to ES module compatibility)
    // if (!isServer) {
    //   const BundleOptimizerPlugin = require('./src/lib/webpack-bundle-optimizer.js');
    //   config.plugins.push(
    //     new BundleOptimizerPlugin({
    //       verbose: dev,
    //       analyze: !dev, // 只在生产环境分析
    //     })
    //   );
    // }

    if (!dev && !isServer) {
      // Optimize bundle splitting with advanced strategies
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        maxAsyncRequests: 30,
        maxInitialRequests: 25,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
            enforce: true,
          },
          // 修复了正则表达式语法错误
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            chunks: "all",
            priority: 20,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix",
            chunks: "all",
            priority: 18,
          },
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: "lucide",
            chunks: "all",
            priority: 16,
          },
          // 路由级别的代码分割
          home: {
            test: /[\\/]src[\\/]components[\\/]home[\\/]/,
            name: "home",
            chunks: "async",
            priority: 8,
          },
          admin: {
            test: /[\\/]src[\\/]components[\\/]admin[\\/]/,
            name: "admin",
            chunks: "async",
            priority: 8,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Enable advanced optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.moduleIds = "deterministic";
      config.optimization.chunkIds = "deterministic";
    }

    return config;
  },
};

export default nextConfig;
