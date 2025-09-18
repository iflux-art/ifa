# @repo/ui

A modern React UI component library built with shadcn/ui design system, Radix UI primitives, and Tailwind CSS.

## Features

- 🎨 Built with shadcn/ui design system
- ⚡ Powered by Radix UI primitives
- 🎯 TypeScript support with full type safety
- 🎪 Storybook integration for component development
- 🧪 Comprehensive testing with Jest and Testing Library
- 📦 Tree-shakable ESM and CJS builds
- 🎨 Tailwind CSS styling with CSS variables for theming

## Usage within this monorepo

This package is used internally within this monorepo project. The components are automatically available to all apps in the monorepo through the pnpm workspace setup.

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@repo/ui'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🚀</Button>

// As child component
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

## Development

```bash
# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Start Storybook
pnpm storybook

# Build the package
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## Storybook

This package includes Storybook for component development and documentation. To start Storybook:

```bash
pnpm storybook
```

Storybook will be available at http://localhost:6006/

## Styling

This package uses Tailwind CSS with CSS variables for theming. Make sure to include the Tailwind configuration and CSS variables in your project.

## TypeScript

All components are fully typed with TypeScript. The package exports all necessary types for props and component references.

```tsx
import type { ButtonProps } from '@repo/ui'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}