# @repo/biome-config

Shared Biome configurations for the monorepo. Biome is a fast formatter and linter for JavaScript, TypeScript, JSX, and JSON.

## Configurations

### `base.json`
Base Biome configuration with common linting rules and formatting settings for all packages.

### `nextjs.json`
Biome configuration optimized for Next.js applications with React-specific rules and accessibility checks.

### `react.json`
Biome configuration for React component libraries with strict type imports and React hooks rules.

## Usage

### In Next.js Apps

Create a `biome.json` file in your app root:

```json
{
  "extends": ["@repo/biome-config/nextjs.json"]
}
```

### In React Libraries

Create a `biome.json` file in your package root:

```json
{
  "extends": ["@repo/biome-config/react.json"]
}
```

### In Other Packages

Create a `biome.json` file in your package root:

```json
{
  "extends": ["@repo/biome-config/base.json"]
}
```

## Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "lint": "biome lint .",
    "lint:fix": "biome lint --apply .",
    "format": "biome format .",
    "format:fix": "biome format --write .",
    "check": "biome check .",
    "check:fix": "biome check --apply ."
  }
}
```

## Features

- **Fast**: Biome is written in Rust and is significantly faster than ESLint + Prettier
- **All-in-one**: Combines linting and formatting in a single tool
- **TypeScript support**: Native TypeScript support without additional configuration
- **React rules**: Includes React-specific linting rules and hooks validation
- **Accessibility**: Built-in accessibility rules for better web standards
- **Import organization**: Automatic import sorting and organization
- **Consistent formatting**: Opinionated formatting that works well with the monorepo

## Configuration Details

### Linting Rules
- Recommended rules enabled by default
- Strict TypeScript rules
- React hooks validation
- Accessibility checks for Next.js apps
- Import/export type enforcement

### Formatting
- 2-space indentation
- Single quotes for strings
- Double quotes for JSX attributes
- Trailing commas (ES5 style)
- 80 character line width
- Semicolons as needed