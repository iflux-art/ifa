import { getWebClientEnv, loadWebEnvConfig } from "./env";
import { loadFeatureFlags } from "./features";

/**
 * Web App Configuration
 */
export class WebAppConfig {
  private static instance: WebAppConfig;
  private env: ReturnType<typeof loadWebEnvConfig>;
  private features: ReturnType<typeof loadFeatureFlags>;

  private constructor() {
    this.env = loadWebEnvConfig();
    this.features = loadFeatureFlags();
  }

  public static getInstance(): WebAppConfig {
    if (!WebAppConfig.instance) {
      WebAppConfig.instance = new WebAppConfig();
    }
    return WebAppConfig.instance;
  }

  /**
   * Get environment configuration
   */
  public getEnv() {
    return this.env;
  }

  /**
   * Get feature flags
   */
  public getFeatures() {
    return this.features;
  }

  /**
   * Get client-safe configuration
   */
  public getClientConfig() {
    return {
      env: getWebClientEnv(),
      features: {
        darkMode: this.features.darkMode,
        animations: this.features.animations,
        accessibility: this.features.accessibility,
        reactCompiler: this.features.reactCompiler,
        ppr: this.features.ppr,
      },
    };
  }

  /**
   * Check if feature is enabled
   */
  public isFeatureEnabled(feature: keyof typeof this.features): boolean {
    return this.features[feature];
  }

  /**
   * Get app metadata
   */
  public getAppMetadata() {
    return {
      name: this.env.NEXT_PUBLIC_APP_NAME,
      url: this.env.NEXT_PUBLIC_APP_URL,
      environment: this.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
    };
  }

  /**
   * Get database configuration
   */
  public getDatabaseConfig() {
    if (!this.env.DATABASE_URL) {
      return null;
    }

    return {
      url: this.env.DATABASE_URL,
      host: this.env.DB_HOST,
      port: this.env.DB_PORT,
      name: this.env.DB_NAME,
      user: this.env.DB_USER,
      password: this.env.DB_PASSWORD,
    };
  }

  /**
   * Get API configuration
   */
  public getApiConfig() {
    return {
      baseUrl: this.env.API_BASE_URL || `${this.env.NEXT_PUBLIC_APP_URL}/api`,
      timeout: this.env.API_TIMEOUT || 5000,
      retries: this.env.API_RETRIES || 3,
    };
  }

  /**
   * Get rate limiting configuration
   */
  public getRateLimitConfig() {
    return {
      requests: this.env.RATE_LIMIT_REQUESTS || 100,
      window: this.env.RATE_LIMIT_WINDOW || 900000, // 15 minutes
    };
  }

  /**
   * Get CORS configuration
   */
  public getCorsConfig() {
    const origins = this.env.CORS_ORIGINS?.split(",") || [this.env.NEXT_PUBLIC_APP_URL];

    return {
      origin: origins,
      credentials: this.env.CORS_CREDENTIALS === "true",
    };
  }
}

// Export singleton instance
export const webConfig = WebAppConfig.getInstance();

// Export configuration functions
export { getWebClientEnv, loadWebEnvConfig } from "./env";
export { SITE_METADATA } from "./metadata";
export { webConfig as default };
