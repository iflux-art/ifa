import { z } from "zod";

/**
 * Hub 应用环境变量模式 - 只保留必需配置
 */
export const hubEnvSchema = z.object({
  // 应用基本信息
  NEXT_PUBLIC_APP_NAME: z.string().default("Hub App"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3002"),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default("3002"),

  // Clerk 认证（必需）
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
});

/**
 * Hub 应用环境配置类型
 */
export type HubEnvConfig = z.infer<typeof hubEnvSchema>;

/**
 * 加载并验证 Hub 应用环境变量
 */
export function loadHubEnvConfig(): HubEnvConfig {
  try {
    const hubConfig = hubEnvSchema.parse(process.env);
    return hubConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`Hub 应用环境变量验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * 获取 Hub 应用的客户端配置
 */
export function getHubClientEnv() {
  const env = loadHubEnvConfig();

  return {
    appName: env.NEXT_PUBLIC_APP_NAME,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    clerkPublishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  };
}
