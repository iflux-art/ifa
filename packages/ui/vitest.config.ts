import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{js,ts,tsx}',
        'src/index.ts',
        'src/test-setup.ts',
        'src/**/*.stories.{js,ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@repo/utils': resolve(__dirname, '../utils/src'),
    },
  },
})
