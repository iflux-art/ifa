# Next.js Monorepo Project

A modern monorepo built with Next.js App Router, pnpm workspace, and Turborepo, featuring four core applications: website, blog, docs, and bookmarks.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers for all apps
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint all packages
pnpm lint

# Format all packages
pnpm format

# Check (lint + format) all packages
pnpm check

# Type check all packages
pnpm type-check
```

## 📁 Project Structure

```
├── apps/
│   ├── website/          # Official website
│   ├── blog/             # Blog application  
│   ├── docs/             # Documentation site
│   └── bookmarks/        # URL bookmarks manager
├── packages/
│   ├── ui/               # Shared UI components
│   ├── utils/            # Utility functions
│   ├── typescript-config/ # TypeScript configurations
│   ├── eslint-config/    # ESLint configurations
│   └── tailwind-config/  # Tailwind CSS configurations
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # pnpm workspace config
└── turbo.json           # Turborepo config
```

## 🏗️ Architecture

This monorepo uses:

- **Next.js 14+** with App Router for all applications
- **pnpm workspace** for efficient package management
- **Turborepo** for fast, cached builds
- **TypeScript** for type safety
- **Biome** for fast linting and formatting
- **Tailwind CSS** for styling
- **Shared packages** for code reuse

## 📦 Applications

### Website (`apps/website`)
Official company website with landing pages, about, and contact information.

### Blog (`apps/blog`) 
Content management and blog post display with Markdown support.

### Docs (`apps/docs`)
Technical documentation site with search and navigation.

### Bookmarks (`apps/bookmarks`)
URL bookmark manager with categories and tags.

## 🔧 Development

### Adding a New App

```bash
cd apps
npx create-next-app@latest new-app --typescript --tailwind --eslint --app --src-dir
```

### Adding a New Package

```bash
mkdir packages/new-package
cd packages/new-package
pnpm init
```

### Running Individual Apps

```bash
# Run specific app
pnpm --filter website dev
pnpm --filter blog build
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @repo/ui test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.