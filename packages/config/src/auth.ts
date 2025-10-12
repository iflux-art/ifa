import type { AuthConfig, OAuthProvider } from "@repo/types";
import { z } from "zod";
import { loadEnvConfig } from "./env";

/**
 * 认证配置模式
 */
const authConfigSchema = z.object({
  jwtSecret: z.string().min(32),
  jwtExpiration: z.string().default("1h"),
  refreshTokenExpiration: z.string().default("7d"),
  bcryptRounds: z.number().min(10).max(15).default(12),
  sessionTimeout: z.number().min(300).default(3600), // 1小时（秒）
  maxLoginAttempts: z.number().min(3).max(10).default(5),
  lockoutDuration: z.number().min(300).default(900), // 15分钟（秒）
});

/**
 * OAuth提供商配置模式
 */
const oauthProviderSchema = z.object({
  name: z.enum(["email", "google", "github", "twitter", "facebook", "apple", "microsoft"]),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
  scope: z.array(z.string()),
  enabled: z.boolean().default(true),
});

/**
 * 从环境变量加载认证配置
 */
export function loadAuthConfig(): AuthConfig {
  const env = loadEnvConfig();

  return authConfigSchema.parse({
    jwtSecret: env.JWT_SECRET,
    jwtExpiration: env.JWT_EXPIRATION,
    refreshTokenExpiration: env.REFRESH_TOKEN_EXPIRATION,
    bcryptRounds: env.BCRYPT_ROUNDS ? Number(env.BCRYPT_ROUNDS) : 12,
    sessionTimeout: env.SESSION_TIMEOUT ? Number(env.SESSION_TIMEOUT) : 3600,
    maxLoginAttempts: env.MAX_LOGIN_ATTEMPTS ? Number(env.MAX_LOGIN_ATTEMPTS) : 5,
    lockoutDuration: env.LOCKOUT_DURATION ? Number(env.LOCKOUT_DURATION) : 900,
  });
}

/**
 * 加载OAuth提供商配置
 */
export function loadOAuthProviders(): OAuthProvider[] {
  const env = loadEnvConfig();
  const providers: OAuthProvider[] = [];

  // Google OAuth
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      oauthProviderSchema.parse({
        name: "google",
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri: env.GOOGLE_REDIRECT_URI || `${env.API_BASE_URL}/auth/google/callback`,
        scope: ["openid", "profile", "email"],
        enabled: env.ENABLE_GOOGLE_AUTH !== "false",
      })
    );
  }

  // GitHub OAuth
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.push(
      oauthProviderSchema.parse({
        name: "github",
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        redirectUri: env.GITHUB_REDIRECT_URI || `${env.API_BASE_URL}/auth/github/callback`,
        scope: ["user:email"],
        enabled: env.ENABLE_GITHUB_AUTH !== "false",
      })
    );
  }

  // Microsoft OAuth
  if (env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET) {
    providers.push(
      oauthProviderSchema.parse({
        name: "microsoft",
        clientId: env.MICROSOFT_CLIENT_ID,
        clientSecret: env.MICROSOFT_CLIENT_SECRET,
        redirectUri: env.MICROSOFT_REDIRECT_URI || `${env.API_BASE_URL}/auth/microsoft/callback`,
        scope: ["openid", "profile", "email"],
        enabled: env.ENABLE_MICROSOFT_AUTH !== "false",
      })
    );
  }

  return providers;
}

/**
 * 根据名称获取OAuth提供商
 */
export function getOAuthProvider(name: string): OAuthProvider | undefined {
  const providers = loadOAuthProviders();
  return providers.find((provider) => provider.name === name && provider.enabled);
}

/**
 * 获取启用的OAuth提供商
 */
export function getEnabledOAuthProviders(): OAuthProvider[] {
  return loadOAuthProviders().filter((provider) => provider.enabled);
}

/**
 * JWT配置
 */
export function getJwtConfig() {
  const config = loadAuthConfig();

  return {
    secret: config.jwtSecret,
    expiresIn: config.jwtExpiration,
    refreshExpiresIn: config.refreshTokenExpiration,
    algorithm: "HS256" as const,
    issuer: "monorepo-app",
    audience: "monorepo-users",
  };
}

/**
 * 密码策略配置
 */
export function getPasswordPolicy() {
  return {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbiddenPasswords: ["password", "123456", "qwerty", "admin", "letmein"],
  };
}

/**
 * 会话配置
 */
export function getSessionConfig() {
  const config = loadAuthConfig();

  return {
    timeout: config.sessionTimeout,
    rolling: true, // 活动时延长会话
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
    name: "session",
  };
}

/**
 * 认证的速率限制配置
 */
export function getAuthRateLimitConfig() {
  const config = loadAuthConfig();

  return {
    login: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: config.maxLoginAttempts,
      skipSuccessfulRequests: true,
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1小时
      max: 5,
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1小时
      max: 3,
    },
    emailVerification: {
      windowMs: 60 * 60 * 1000, // 1小时
      max: 5,
    },
  };
}

/**
 * 双因素认证配置
 */
export function getTwoFactorConfig() {
  return {
    issuer: "Monorepo App",
    window: 1, // 允许当前时间前后1步
    digits: 6,
    period: 30, // 30秒
    algorithm: "sha1" as const,
    backupCodesCount: 10,
    backupCodeLength: 8,
  };
}

/**
 * 验证认证配置
 */
export function validateAuthConfig(config: AuthConfig): void {
  try {
    authConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`认证配置验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}
