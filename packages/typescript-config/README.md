# @repo/typescript-config

Shared TypeScript configurations for the monorepo.

## Configurations

### `base.json`
Base TypeScript configuration with common settings for all packages.

### `nextjs.json`
TypeScript configuration optimized for Next.js applications with App Router.

### `react-library.json`
TypeScript configuration for React component libraries and packages.

## Usage

### In Next.js Apps

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ]
}
```

### In React Libraries

```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "baseUrl": "src"
  }
}
```

### In Other Packages

```json
{
  "extends": "@repo/typescript-config/base.json"
}
```

## Features

- Strict type checking enabled
- Modern ES2017 target
- ESNext modules with bundler resolution
- Incremental compilation support
- Declaration file generation for libraries
- Optimized for monorepo development