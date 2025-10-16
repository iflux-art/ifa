# Sub-Application Standardization Guide

This document outlines the standardized structure and configuration for all sub-applications in the monorepo.

> **📖 完整文档**: 请参考 [APPLICATION_STRUCTURE_STANDARDS.md](./APPLICATION_STRUCTURE_STANDARDS.md) 获取详细的结构标准和 [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md) 获取代码风格指南。

## 快速工具 (Quick Tools)

### 验证应用结构
```bash
node apps/.template/validate-app-structure.js apps/web
```

### 标准化现有应用
```bash
# 预览模式
node apps/.template/standardize-app.js --dry-run apps/web

# 实际执行
node apps/.template/standardize-app.js apps/web
```

## Directory Structure

All sub-applications follow this standardized directory structure:

```
app-name/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout component
│   │   ├── page.tsx         # Home page
│   │   ├── loading.tsx      # Loading UI
│   │   ├── not-found.tsx    # 404 page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── theme/          # Theme-related components
│   │   └── index.ts        # Component exports
│   ├── lib/                # Utility libraries
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Library exports
│   ├── hooks/              # Custom React hooks
│   │   └── index.ts        # Hook exports
│   ├── stores/             # State management (Zustand)
│   │   └── index.ts        # Store exports
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Type exports
│   ├── config/             # Application configuration
│   │   ├── index.ts        # Main config
│   │   └── metadata.ts     # Metadata config
│   ├── test/               # Test utilities and setup
│   │   └── setup.ts        # Test setup
│   └── middleware.ts       # Next.js middleware
├── e2e/                    # End-to-end tests
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── biome.json              # Biome linting configuration
├── vitest.config.ts        # Vitest testing configuration
├── playwright.config.ts    # Playwright E2E configuration
├── tailwind.config.mjs     # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
├── vercel.json             # Deployment configuration
├── .env.example            # Environment variables template
└── README.md               # Application documentation
```

## Configuration Standards

### Package.json
- Consistent scripts across all applications
- Standardized dependencies and versions
- Proper metadata and repository information

### Next.js Configuration
- Optimized for Next.js 15 features
- Turbopack configuration for development
- Advanced webpack optimizations for production
- Consistent path aliases and resolve extensions

### TypeScript Configuration
- Strict type checking enabled
- Consistent path mappings
- Shared package references
- Performance optimizations

### Biome Configuration
- Extends root configuration
- Consistent linting rules
- Performance and correctness checks

### Testing Configuration
- Vitest for unit testing
- Playwright for E2E testing
- Consistent coverage thresholds
- Proper test setup and utilities

## Naming Conventions

### Files and Directories
- Use kebab-case for directory names
- Use PascalCase for React components
- Use camelCase for utility functions
- Use UPPER_CASE for constants

### Import/Export Patterns
- Use index.ts files for clean exports
- Consistent import aliases (@/components, @/lib, etc.)
- Proper re-exports from shared packages

## Development Standards

### Code Organization
- Components organized by feature/domain
- Utilities grouped by functionality
- Types co-located with related code
- Configuration centralized in config directory

### State Management
- Zustand for client-side state
- Server state handled by React Query (if needed)
- Global state minimized and well-defined

### Styling
- Tailwind CSS for styling
- CSS variables for theming
- Component-scoped styles when needed
- Consistent design system usage

## Build and Deployment

### Independent Deployment
- Each application can be deployed independently
- Shared dependencies managed through packages
- Environment-specific configurations
- Proper build optimization

### Performance Optimization
- Code splitting and lazy loading
- Bundle size optimization
- Caching strategies
- Tree shaking enabled

## Quality Assurance

### Testing Strategy
- Unit tests for critical functionality
- Integration tests for component interactions
- E2E tests for user workflows
- Coverage thresholds maintained

### Code Quality
- Consistent linting and formatting
- Type safety enforced
- Performance monitoring
- Security best practices

## Migration Checklist

When standardizing an existing application:

- [ ] Update directory structure
- [ ] Standardize configuration files
- [ ] Update package.json scripts and dependencies
- [ ] Configure path aliases and imports
- [ ] Set up testing infrastructure
- [ ] Update documentation
- [ ] Verify build and deployment
- [ ] Test all functionality

## Shared Packages Integration

All applications should properly integrate with shared packages:

- `@repo/ui` - Shared UI components
- `@repo/utils` - Shared utility functions
- `@repo/types` - Shared type definitions
- `@repo/config` - Shared configuration

## Environment Configuration

Each application should have:
- `.env.example` with all required variables
- Environment-specific configurations
- Proper secret management
- Feature flags support

## Monitoring and Maintenance

- Performance monitoring setup
- Error tracking integration
- Dependency update automation
- Security vulnerability scanning