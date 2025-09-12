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

## Installation

```bash
# Install the package
pnpm add @repo/ui

# Install peer dependencies
pnpm add react react-dom
```

## Usage

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui'

function App() {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => console.log('Hello!')}>
          Click me
        </Button>
      </CardContent>
    </Card>
  )
}
```

## Components

### Badge

A small status indicator component with multiple variants.

```tsx
import { Badge } from '@repo/ui'

// Basic usage
<Badge>New</Badge>

// With variants
<Badge variant="secondary">Beta</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

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

### Card

A flexible card component for displaying content.

```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@repo/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog (Modal)

A modal dialog component built with Radix UI.

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@repo/ui'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description goes here.
      </DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

### Input

A styled input component with focus states.

```tsx
import { Input } from '@repo/ui'

<Input 
  type="email" 
  placeholder="Enter your email" 
  className="w-full"
/>
```

### Label

A form label component that works with form controls.

```tsx
import { Label, Input } from '@repo/ui'

<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
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

## Styling

This package uses Tailwind CSS with CSS variables for theming. Make sure to include the Tailwind configuration and CSS variables in your project.

## TypeScript

All components are fully typed with TypeScript. The package exports all necessary types for props and component references.

```tsx
import type { ButtonProps } from '@repo/ui'

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />
}
```