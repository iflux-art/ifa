/** @type {import('tailwindcss').Config} */
module.exports = {
  extends: ['@repo/tailwind-config'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
}
