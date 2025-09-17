# Next.js Monorepo Project

A modern monorepo project built with Next.js App Router, pnpm workspace, and Turborepo. This project contains four independent applications that can be developed together or deployed separately.

## 🚀 Applications

- **Website** - Main company website
- **Blog** - Markdown-based blog system
- **Docs** - Technical documentation with search functionality
- **Hub** - Bookmark management system

## 🏗️ Architecture

This project uses a monorepo architecture with the following technologies:

- **Next.js 14+** with App Router for server-side rendering and routing
- **pnpm workspace** for efficient package management
- **Turborepo** for caching builds and parallel task execution
- **TypeScript** for type safety
- **Biome** for fast code formatting and linting
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

### Shared Packages

- `@repo/ui` - Shared UI components
- `@repo/utils` - Utility functions
- `@repo/tailwind-config` - Tailwind CSS configurations
- `@repo/typescript-config` - TypeScript configurations

### One-Click Independent Deployment

To deploy an application independently:

1. Download or clone the specific application directory (e.g., `apps/docs`)
2. Install dependencies and build the application:
   ```bash
   pnpm install
   pnpm build
   ```

Each application in this monorepo can be deployed independently without downloading the entire project.

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