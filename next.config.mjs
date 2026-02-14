import createMDX from "@next/mdx";

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

	// Enable Next.js 15 features and optimizations
	experimental: {
		// Enable optimized package imports for better tree shaking
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],

		// Enable server actions for React 19 compatibility
		serverActions: {
			allowedOrigins: ["localhost:3000", "localhost:3001", "localhost:3002"],
		},

		// MDX specific optimizations
		mdxRs: true,
	},

	// Simplified Turbopack configuration
	turbopack: {
		resolveAlias: {
			"@": "./src",
			"@/components": "./src/components",
			"@/lib": "./src/lib",
			"@/utils": "./src/utils",
			"@/hooks": "./src/hooks",
			"@/stores": "./src/stores",
			"@/types": "./src/types",
			"@/config": "./src/config",
			"@/content": "./src/content",
		},
	},

	// Performance optimizations
	compress: true,
	poweredByHeader: false,

	// Simplified webpack optimizations
	webpack: (config, { dev, webpack }) => {
		// Disable React DevTools in production
		if (!dev) {
			config.plugins.push(
				new webpack.DefinePlugin({
					__REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })",
				}),
			);
		}

		return config;
	},
};

const withMDX = createMDX({
	// Add providerImportSource configuration if needed
	// options: {
	//   providerImportSource: "@mdx-js/react",
	// },
});

export default withMDX(nextConfig);
