import { z } from "zod";

/**
 * Web 应用环境变量模式 - 只保留必需配置
 */
export const webEnvSchema = z.object({
  // 应用基本信息
  NEXT_PUBLIC_APP_NAME: z.string().default("Web App"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default("3000"),
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
    return webEnvSchema.parse(process.env);
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
 * 获取客户端配置
 */
export function getClientConfig() {
  const env = loadWebEnvConfig();
  return {
    appName: env.NEXT_PUBLIC_APP_NAME,
    appUrl: env.NEXT_PUBLIC_APP_URL,
  };
}
