# @repo/config

Shared configuration management for the monorepo with environment validation and type safety.

## Features

- **Environment Variables**: Validation and type-safe access to environment variables
- **Feature Flags**: Centralized feature toggle management
- **Database Configuration**: Database connection and pool settings
- **Authentication Configuration**: JWT, OAuth, and security settings
- **API Configuration**: Endpoints, timeouts, rate limiting, and CORS

## Usage

### Environment Configuration

```typescript
import { loadEnvConfig, isDevelopment, getEnv } from '@repo/config/env'

// Load and validate all environment variables
const env = loadEnvConfig()

// Check environment
if (isDevelopment()) {
  console.log('Running in development mode')
}

// Get specific environment variable with fallback
const port = getEnv('PORT', 3000)
```

### Feature Flags

```typescript
import { 
  loadFeatureFlags, 
  isFeatureEnabled, 
  getClientFeatureFlags 
} from '@repo/config/features'

// Check if a feature is enabled
if (isFeatureEnabled('reactCompiler')) {
  // Use React Compiler
}

// Get client-safe feature flags
const clientFeatures = getClientFeatureFlags()
```

### Database Configuration

```typescript
import { 
  loadDatabaseConfig, 
  getDatabaseUrl, 
  loadPoolConfig 
} from '@repo/config/database'

// Get database configuration
const dbConfig = loadDatabaseConfig()

// Get connection string
const connectionString = getDatabaseUrl()

// Get pool configuration
const poolConfig = loadPoolConfig()
```

### Authentication Configuration

```typescript
import { 
  loadAuthConfig, 
  getJwtConfig, 
  loadOAuthProviders 
} from '@repo/config/auth'

// Get auth configuration
const authConfig = loadAuthConfig()

// Get JWT settings
const jwtConfig = getJwtConfig()

// Get OAuth providers
const oauthProviders = loadOAuthProviders()
```

### API Configuration

```typescript
import { 
  loadApiConfig, 
  getApiEndpoints, 
  getTimeoutConfig 
} from '@repo/config/api'

// Get API configuration
const apiConfig = loadApiConfig()

// Get API endpoints
const endpoints = getApiEndpoints()

// Get timeout configuration
const timeouts = getTimeoutConfig()
```

## Environment Variables

The package validates the following environment variables:

### Basic Configuration
- `NODE_ENV` - Application environment (development, production, test, staging)
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: localhost)
- `LOG_LEVEL` - Logging level (error, warn, info, debug, trace)

### Database
- `DATABASE_URL` - Complete database connection string
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Individual database settings

### Authentication
- `JWT_SECRET` - JWT signing secret (required, min 32 characters)
- `JWT_EXPIRATION` - JWT token expiration (default: 1h)
- `REFRESH_TOKEN_EXPIRATION` - Refresh token expiration (default: 7d)

### Feature Flags
- `ENABLE_REACT_COMPILER` - Enable React Compiler (default: true)
- `ENABLE_PPR` - Enable Partial Prerendering (default: true)
- `ENABLE_TURBOPACK` - Enable Turbopack (default: true)
- `ENABLE_DARK_MODE` - Enable dark mode support (default: true)

### OAuth Providers
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth

## Validation

All configuration is validated using Zod schemas with helpful error messages:

```typescript
import { validateAuthConfig } from '@repo/config/auth'

try {
  const config = loadAuthConfig()
  validateAuthConfig(config)
} catch (error) {
  console.error('Configuration error:', error.message)
}
```

## Development

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev

# Run tests
pnpm test

# Type check
pnpm type-check
```