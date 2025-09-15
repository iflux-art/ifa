# Biome Configuration for @repo/ui

## Design Decision

This package contains a full copy of the Biome configuration rather than referencing the shared `@repo/biome-config` package. This decision was made due to path resolution issues encountered in the pnpm workspace environment.

## Reasoning

1. **Path Resolution Issues**: Attempts to reference `@repo/biome-config/react` from this package resulted in "module not found" errors, even with correct relative paths.

2. **Workspace Structure**: As a shared package in the `packages/` directory (rather than `apps/`), the path resolution behaves differently than in application packages.

3. **Stability**: Duplicating the configuration ensures stable and predictable behavior without dependency on external package resolution.

## Maintenance

When updating Biome rules:
1. Ensure changes are synchronized across all packages
2. Check both `@repo/ui` and `@repo/utils` packages
3. Refer to `@repo/biome-config/react.json` and `@repo/biome-config/base.json` for the source of truth

## Future Improvements

We could explore:
1. Creating a script to automatically sync configurations
2. Investigating pnpm workspace linking issues further
3. Using a different approach to shared configurations in workspaces