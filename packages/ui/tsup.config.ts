import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: !options.watch, // Skip DTS generation in watch mode for faster rebuilds
  splitting: false,
  sourcemap: true,
  clean: !options.watch, // Skip cleaning in watch mode for faster rebuilds
  external: ['react', 'react-dom'],
  banner: {
    js: '"use client"',
  },
  // Development optimizations
  ...(options.watch && {
    onSuccess: 'echo "✅ UI package rebuilt successfully"',
    // Enable faster incremental builds
    incremental: true,
  }),
  // Production optimizations
  ...(!options.watch && {
    minify: false, // Keep readable for debugging
    treeshake: true,
  }),
}))
