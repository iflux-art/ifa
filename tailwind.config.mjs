/** @type {import('tailwindcss').Config} */
export default {
	// Enable Tailwind CSS 4.1 new CSS engine optimizations
	future: {
		hoverOnlyWhenSupported: true,
		respectDefaultRingColorOpacity: true,
	},

	// Optimized dark mode configuration
	darkMode: ["class", '[data-theme="dark"]'],
	// Optimized content configuration for better build performance
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			// Removed unused custom color palettes (brand, success, warning, error)
			// Using Tailwind's default color system for better consistency
			fontFamily: {
				sans: [
					"Inter",
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"Helvetica Neue",
					"Arial",
					"Noto Sans",
					"sans-serif",
					"Apple Color Emoji",
					"Segoe UI Emoji",
					"Segoe UI Symbol",
					"Noto Color Emoji",
				],
				// Keep mono font stack as it's used in code blocks
				mono: [
					"ui-monospace",
					"SFMono-Regular",
					"Monaco",
					"Consolas",
					"Liberation Mono",
					"Courier New",
					"monospace",
				],
			},
			// Removed unused custom fontSize (using Tailwind defaults)
			// Removed unused custom spacing (18, 88, 112, 128)
			// Removed unused custom borderRadius (4xl, 5xl)
			// Removed unused custom boxShadow (inner-lg, inner-xl)
			// Removed unused custom animations and keyframes
			// Using Tailwind's default breakpoints
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "none",
						color: "var(--foreground)",
						a: {
							color: "var(--primary)",
							textDecoration: "underline",
							fontWeight: "500",
							"&:hover": {
								opacity: 0.8,
							},
						},
						'[class~="lead"]': {
							color: "var(--muted-foreground)",
						},
						strong: {
							color: "var(--foreground)",
							fontWeight: "600",
						},
						'ol[type="A"]': {
							"--list-counter-style": "upper-alpha",
						},
						'ol[type="a"]': {
							"--list-counter-style": "lower-alpha",
						},
						'ol[type="A" s]': {
							"--list-counter-style": "upper-alpha",
						},
						'ol[type="a" s]': {
							"--list-counter-style": "lower-alpha",
						},
						'ol[type="I"]': {
							"--list-counter-style": "upper-roman",
						},
						'ol[type="i"]': {
							"--list-counter-style": "lower-roman",
						},
						'ol[type="I" s]': {
							"--list-counter-style": "upper-roman",
						},
						'ol[type="i" s]': {
							"--list-counter-style": "lower-roman",
						},
						'ol[type="1"]': {
							"--list-counter-style": "decimal",
						},
						"ol > li": {
							position: "relative",
						},
						"ol > li::marker": {
							fontWeight: "400",
							color: "var(--muted-foreground)",
						},
						"ul > li": {
							position: "relative",
						},
						"ul > li::marker": {
							color: "var(--muted-foreground)",
						},
						hr: {
							borderColor: "var(--border)",
							borderTopWidth: 1,
						},
						blockquote: {
							fontWeight: "500",
							fontStyle: "italic",
							color: "var(--foreground)",
							borderLeftWidth: "0.25rem",
							borderLeftColor: "var(--border)",
							quotes: '"\\201C""\\201D""\\2018""\\2019"',
						},
						h1: {
							color: "var(--foreground)",
							fontWeight: "800",
						},
						h2: {
							color: "var(--foreground)",
							fontWeight: "700",
						},
						h3: {
							color: "var(--foreground)",
							fontWeight: "600",
						},
						h4: {
							color: "var(--foreground)",
							fontWeight: "600",
						},
						code: {
							color: "var(--foreground)",
							fontWeight: "600",
						},
						"code::before": {
							content: '"`"',
						},
						"code::after": {
							content: '"`"',
						},
						pre: {
							color: "var(--foreground)",
							backgroundColor: "var(--muted)",
							overflowX: "auto",
						},
						"pre code": {
							backgroundColor: "transparent",
							borderWidth: "0",
							borderRadius: "0",
							padding: "0",
							fontWeight: "400",
							color: "inherit",
							fontSize: "inherit",
							fontFamily: "inherit",
							lineHeight: "inherit",
						},
						"pre code::before": {
							content: "none",
						},
						"pre code::after": {
							content: "none",
						},
						table: {
							width: "100%",
							tableLayout: "auto",
							textAlign: "left",
							marginTop: "2em",
							marginBottom: "2em",
							fontSize: "0.875em",
							lineHeight: "1.7142857",
						},
						thead: {
							color: "var(--foreground)",
							fontWeight: "600",
							borderBottomWidth: "1px",
							borderBottomColor: "var(--border)",
						},
						"thead th": {
							verticalAlign: "bottom",
							paddingRight: "0.5714286em",
							paddingBottom: "0.5714286em",
							paddingLeft: "0.5714286em",
						},
						"tbody tr": {
							borderBottomWidth: "1px",
							borderBottomColor: "var(--border)",
						},
						"tbody tr:last-child": {
							borderBottomWidth: "0",
						},
						"tbody td": {
							verticalAlign: "top",
							paddingTop: "0.5714286em",
							paddingRight: "0.5714286em",
							paddingBottom: "0.5714286em",
							paddingLeft: "0.5714286em",
						},
					},
				},
			},
		},
	},
	plugins: [
		// Removed unused plugins: @tailwindcss/forms, @tailwindcss/aspect-ratio
		// Keeping plugins that are actually used in the blog codebase
		import("@tailwindcss/typography"), // Used for prose classes in MDX content
		import("@tailwindcss/container-queries"), // Used in card components
	],

	// CSS optimization settings for better performance
	experimental: {
		optimizeUniversalDefaults: true,
	},
};
