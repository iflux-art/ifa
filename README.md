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

## 🚀 Independent Deployment

Each application in this monorepo can be deployed independently without downloading the entire project.

### Using Published npm Packages

The shared packages in this monorepo are also published to npm under the `@iflux-art` organization:

- `@iflux-art/ui` - Shared UI components
- `@iflux-art/utils` - Utility functions
- `@iflux-art/tailwind-config` - Tailwind CSS configurations
- `@iflux-art/typescript-config` - TypeScript configurations

You can use these packages directly in your projects without copying code:

```bash
npm install @iflux-art/ui @iflux-art/utils
```

```javascript
import { Button } from '@iflux-art/ui';
import { cn } from '@iflux-art/utils';
```

### One-Click Independent Deployment

To deploy an application independently:

1. Download or clone the specific application directory (e.g., `apps/docs`)
2. Run the setup script in the application directory:
   ```bash
   cd apps/docs
   node setup-standalone.js
   ```
3. Install dependencies and build the application:
   ```bash
   pnpm install
   pnpm build
   ```

The setup script automatically:
- Replaces workspace dependencies with npm package dependencies
- Updates configuration files
- Prepares the application for independent deployment

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