# Configuration Template System

This directory contains the enhanced configuration template system for standardizing and synchronizing configurations across all applications in the monorepo.

## Overview

The configuration template system provides:

- **Standardized Templates**: Unified configuration files for all apps
- **Variable Substitution**: App-specific customization through template variables
- **Automatic Synchronization**: Tools to sync configurations across apps
- **Validation**: Ensure all apps follow the same standards
- **Consistency Checking**: Detect configuration drift between apps

## Directory Structure

```
apps/.template/
├── template-config.json          # Configuration definitions and app-specific settings
├── package.json.template         # Package.json template with variables
├── tsconfig.json                 # TypeScript configuration template
├── biome.json                    # Biome linting configuration template
├── next.config.mjs               # Next.js configuration template
├── tailwind.config.mjs           # Tailwind CSS configuration template
├── vitest.config.ts              # Vitest testing configuration template
├── playwright.config.ts          # Playwright E2E testing configuration template
├── postcss.config.mjs            # PostCSS configuration template
├── .env.example                  # Environment variables template
├── scripts/
│   ├── load-env.js               # Environment loading script template
│   └── check-project.js          # Project health check script template
├── src/test/
│   └── setup.ts                  # Test setup file template
└── CONFIG_SYNC_README.md         # This documentation
```

## Configuration Management Tools

The following tools are available in the `scripts/` directory:

### 1. Configuration Synchronization (`sync-configs.js`)

Synchronizes configuration files from templates to applications.

```bash
# Sync all apps
node scripts/sync-configs.js sync

# Sync specific app
node scripts/sync-configs.js sync web

# Validate configurations
node scripts/sync-configs.js validate

# Check consistency
node scripts/sync-configs.js check
```

**Features:**
- Variable substitution for app-specific values
- Intelligent merging of package.json (preserves existing dependencies)
- App-specific customizations support
- Validation of synchronized configurations
- Consistency checking across apps

### 2. Configuration Validation (`validate-configs.js`)

Validates that all application configurations meet the template standards.

```bash
# Validate all apps
node scripts/validate-configs.js

# Validate specific app
node scripts/validate-configs.js web
```

**Checks:**
- Required files and directories exist
- Package.json has all required scripts and dependencies
- TypeScript configuration is correct
- Biome configuration extends root config
- Next.js configuration includes required optimizations
- Environment files contain required variables

### 3. Configuration Diff (`diff-configs.js`)

Compares configurations between apps and against templates to identify differences.

```bash
# Compare all apps with template and each other
node scripts/diff-configs.js all

# Compare specific app with template
node scripts/diff-configs.js template web

# Compare two apps
node scripts/diff-configs.js apps web blog
```

## Template Configuration

### Variable System

The `template-config.json` file defines:

1. **Template Variables**: Placeholders used in template files
2. **App-Specific Configs**: Values for each application

#### Template Variables

```json
{
  "templateVariables": {
    "{{APP_NAME}}": {
      "description": "Application name",
      "required": true
    },
    "{{APP_DESCRIPTION}}": {
      "description": "Application description",
      "required": true
    },
    "{{DEV_PORT}}": {
      "description": "Development server port",
      "required": false,
      "default": ""
    }
  }
}
```

#### App-Specific Configurations

```json
{
  "appSpecificConfigs": {
    "web": {
      "APP_NAME": "@repo/web",
      "APP_DESCRIPTION": "Modern web application built with Next.js 15",
      "DEV_PORT": "",
      "additionalDependencies": {},
      "additionalDevDependencies": {
        "@tailwindcss/forms": "^0.5.9"
      }
    }
  }
}
```

### Supported Customizations

Each app can have:

- **Additional Dependencies**: Extra production dependencies
- **Additional Dev Dependencies**: Extra development dependencies  
- **Additional Scripts**: App-specific npm scripts
- **Custom Variables**: App-specific template variable values

## Usage Workflow

### 1. Initial Setup

```bash
# Sync all configurations for the first time
node scripts/sync-configs.js sync

# Validate everything is correct
node scripts/validate-configs.js

# Check for any inconsistencies
node scripts/diff-configs.js all
```

### 2. Adding a New App

1. Add app configuration to `template-config.json`:

```json
{
  "appSpecificConfigs": {
    "new-app": {
      "APP_NAME": "new-app",
      "APP_DESCRIPTION": "Description of the new app",
      "DEV_PORT": " --port 3003",
      "START_PORT": " --port 3003",
      "APP_URL": "http://localhost:3003",
      "PLAYWRIGHT_BASE_URL": "http://localhost:3003",
      "HOMEPAGE_URL": "https://github.com/org/new-app",
      "REPOSITORY_URL": "https://github.com/org/new-app.git"
    }
  }
}
```

2. Create the app directory structure
3. Run synchronization:

```bash
node scripts/sync-configs.js sync new-app
```

### 3. Updating Templates

1. Modify template files in `apps/.template/`
2. Update `template-config.json` if new variables are needed
3. Sync all apps:

```bash
node scripts/sync-configs.js sync
```

4. Validate and test:

```bash
node scripts/validate-configs.js
node scripts/diff-configs.js all
```

### 4. Regular Maintenance

Run these commands periodically to ensure consistency:

```bash
# Check for configuration drift
node scripts/diff-configs.js all

# Validate all configurations
node scripts/validate-configs.js

# Re-sync if needed
node scripts/sync-configs.js sync
```

## File Templates

### Package.json Template

The `package.json.template` includes:

- **Standardized Scripts**: Unified npm scripts across all apps
- **Core Dependencies**: Essential dependencies for all Next.js apps
- **Development Tools**: Biome, TypeScript, Tailwind, Vitest, Playwright
- **Variable Substitution**: App-specific names, ports, and URLs
- **Intelligent Merging**: Preserves existing dependencies when syncing

### Configuration Files

All configuration files support:

- **Variable Substitution**: App-specific customization
- **Consistent Standards**: Unified settings across apps
- **Best Practices**: Optimized configurations for performance and development

### Script Templates

Standardized scripts for:

- **Environment Loading**: Consistent environment variable handling
- **Project Health Checks**: Automated validation of project setup
- **Development Workflow**: Unified development commands

## Best Practices

### 1. Template Updates

- Always test template changes on a single app first
- Use the diff tool to review changes before applying
- Update all apps simultaneously to maintain consistency

### 2. App-Specific Customizations

- Use `additionalDependencies` for app-specific packages
- Avoid modifying core template configurations directly
- Document any customizations in the app's README

### 3. Validation

- Run validation after any configuration changes
- Set up CI/CD to validate configurations automatically
- Use the diff tool to catch configuration drift

### 4. Version Management

- Keep template configurations in version control
- Tag template versions for rollback capability
- Document breaking changes in template updates

## Troubleshooting

### Common Issues

1. **Sync Failures**
   - Check file permissions
   - Ensure template files are valid JSON/JavaScript
   - Verify app exists in `template-config.json`

2. **Validation Errors**
   - Run sync to fix missing configurations
   - Check for syntax errors in configuration files
   - Ensure all required dependencies are present

3. **Inconsistencies**
   - Use diff tool to identify specific differences
   - Re-sync affected apps
   - Check for manual modifications to generated files

### Getting Help

1. Run tools with verbose output for debugging
2. Check the generated files for syntax errors
3. Validate individual apps to isolate issues
4. Use the diff tool to understand what changed

## Integration with Development Workflow

### Pre-commit Hooks

Add configuration validation to pre-commit hooks:

```json
{
  "lint-staged": {
    "apps/*/package.json": ["node scripts/validate-configs.js"],
    "apps/.template/**": ["node scripts/validate-configs.js"]
  }
}
```

### CI/CD Integration

Include in your CI pipeline:

```yaml
- name: Validate Configurations
  run: node scripts/validate-configs.js

- name: Check Configuration Consistency  
  run: node scripts/diff-configs.js all
```

This ensures all configurations remain consistent and valid across the entire monorepo.