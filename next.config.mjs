import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Allow MDX files as pages
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

	// Enable React Strict Mode for both development and production
	// This helps catch potential problems early during development
	reactStrictMode: true,

	// Enable Next.js 15 features and optimizations
	experimental: {
		// Enable optimized package imports for better tree shaking
		optimizePackageImports: ["lucide-react"],

		// MDX specific optimizations - use Rust compiler for better performance
		mdxRs: true,
	},

	// Performance optimizations
	compress: true,
	poweredByHeader: false,
};

// Configure MDX with remark plugins
const withMDX = createMDX({
	options: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [],
	},
});

export default withMDX(nextConfig);
