import { z } from "zod";

/**
 * 简化的 Web 应用环境变量模式
 */
export const webEnvSchema = z.object({
  // 基础环境变量
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Web 应用核心配置
  NEXT_PUBLIC_APP_NAME: z.string().default("Web App"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // 核心功能开关
  NEXT_PUBLIC_ENABLE_DARK_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_ANIMATIONS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_ACCESSIBILITY: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

/**
 * Web 应用环境配置类型
 */
export type WebEnvConfig = z.infer<typeof webEnvSchema>;

/**
 * 加载并验证 Web 应用环境变量
 */
export function loadWebEnvConfig(): WebEnvConfig {
  try {
    const webConfig = webEnvSchema.parse(process.env);
    return webConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(`Web 应用环境变量验证失败:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * 获取客户端安全的环境变量
 */
export function getClientConfig() {
  const env = loadWebEnvConfig();

  return {
    appName: env.NEXT_PUBLIC_APP_NAME,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    features: {
      darkMode: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
      animations: env.NEXT_PUBLIC_ENABLE_ANIMATIONS,
      accessibility: env.NEXT_PUBLIC_ENABLE_ACCESSIBILITY,
    },
  };
}
