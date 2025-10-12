import type { AppConfig } from '@/types'

export const appConfig: AppConfig = {
  name: 'your-app',
  version: '1.0.0',
  environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
}

// Add other configuration here