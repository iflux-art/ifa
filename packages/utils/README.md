# @repo/utils

Shared utility functions for the monorepo. 

## Usage within this monorepo

This package is used internally within this monorepo project. The utilities are automatically available to all apps in the monorepo through the pnpm workspace setup.

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
pnpm test:watch
```

### Linting and Formatting

```bash
pnpm lint
pnpm format
pnpm check
```

## Features

- **Type Safe**: Full TypeScript support with proper type definitions
- **Tree Shakeable**: Import only what you need
- **Well Tested**: Comprehensive test coverage
- **Performance Optimized**: Efficient implementations
- **Zero Dependencies**: Minimal external dependencies (only clsx for class names)
- **Consistent API**: Predictable function signatures and behavior