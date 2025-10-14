/** @type {import('tailwindcss').Config} */
export default {
  // Optimized dark mode configuration
  darkMode: ["class", '[data-theme="dark"]'],

  // Optimized content configuration for better build performance
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        // Removed unused mono font stack
      },
    },
  },
  plugins: [import("@tailwindcss/container-queries")],
};
