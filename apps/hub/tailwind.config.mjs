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
        // Removed unused mono font stack (JetBrains Mono, Fira Code not used)
      },
      // Removed unused custom fontSize (using Tailwind defaults)
      // Removed unused custom spacing (18, 88, 112, 128)
      // Removed unused custom borderRadius (4xl, 5xl)
      // Removed unused custom animations and keyframes
      // Using Tailwind's default breakpoints
      // Removed unused typography configuration (no prose classes found in codebase)
    },
  },
  plugins: [
    // Removed unused plugins: @tailwindcss/forms, @tailwindcss/typography
    // Keeping only plugins that are actually used in the codebase
    import("@tailwindcss/aspect-ratio"),
    import("@tailwindcss/container-queries"),
  ],

  // CSS optimization settings for better performance
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
