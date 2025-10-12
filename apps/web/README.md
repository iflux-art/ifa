# Web Application

Main web application for the iFlux Art platform.

## Getting Started

### Prerequisites

- Node.js 22.x
- pnpm 9.15.9

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
- `pnpm test` - Run tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── theme/          # Theme-related components
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── stores/             # State management (Zustand)
├── types/              # TypeScript type definitions
├── config/             # Application configuration
└── test/               # Test utilities and setup
```

## Technology Stack

- **Framework**: Next.js 15
- **Runtime**: React 19
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4.1
- **State Management**: Zustand
- **Testing**: Vitest + Playwright
- **Linting**: Biome

## Features

- ✅ React 19 with Compiler optimizations
- ✅ Next.js 15 with Turbopack and PPR
- ✅ TypeScript with strict configuration
- ✅ Tailwind CSS with design system
- ✅ Dark/Light theme support
- ✅ Comprehensive testing setup
- ✅ Modern development tooling

## Development

This application is part of a monorepo and shares packages with other applications. Make sure to run commands from the root of the monorepo when working with shared dependencies.

## Deployment

The application is configured for independent deployment and can be deployed to any platform that supports Next.js applications.