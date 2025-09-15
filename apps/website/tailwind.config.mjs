/** @type {import('tailwindcss').Config} */
export default {
  presets: [import('@repo/tailwind-config/nextjs')],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
