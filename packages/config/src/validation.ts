import { z } from "zod";
import type { Environment } from "@repo/types";

/**
 * 环境特定的验证规则
 */
export const environmentValidationRules = {
  development: {
    required: ["NODE_ENV", "JWT_SECRET"],
    optional: ["DATABASE_URL", "REDIS_URL", "API_BASE_URL"],
  },
  test: {
    required: ["NODE_ENV", "JWT_SECRET"],
    optional: ["DATABASE_URL"],
  },
  production: {
    required: ["NODE_ENV", "JWT_SECRET", "DATABASE_URL", "NEXT_PUBLIC_APP_URL"],
    optional: ["REDIS_URL", "SENTRY_DSN", "API_BASE_URL"],
  },
  staging: {
    required: ["NODE_ENV", "JWT_SECRET", "DATABASE_URL", "NEXT_PUBLIC_APP_URL"],
    optional: ["REDIS_URL", "SENTRY_DSN", "API_BASE_URL"],
  },
} as const;

/**
 * 检查必需的环境变量
 */
function checkRequiredVariables(
  env: Record<string, string | undefined>,
  required: readonly string[]
): string[] {
  const errors: string[] = [];
  for (const key of required) {
    if (!env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }
  return errors;
}

/**
 * 检查可选的环境变量
 */
function checkOptionalVariables(
  env: Record<string, string | undefined>,
  optional: readonly string[]
): string[] {
  const warnings: string[] = [];
  for (const key of optional) {
    if (!env[key]) {
      warnings.push(`Optional environment variable not set: ${key}`);
    }
  }
  return warnings;
}

/**
 * 验证生产/预发布环境的特定要求
 */
function validateProductionEnvironment(env: Record<string, string | undefined>): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
    errors.push("JWT_SECRET must be at least 32 characters long in production");
  }

  if (env.NEXT_PUBLIC_APP_URL && !env.NEXT_PUBLIC_APP_URL.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_APP_URL must use HTTPS in production");
  }

  if (env.DATABASE_URL?.includes("localhost")) {
    warnings.push("DATABASE_URL appears to use localhost in production");
  }

  return { errors, warnings };
}

/**
 * 验证开发环境的特定要求
 */
function validateDevelopmentEnvironment(env: Record<string, string | undefined>): string[] {
  const warnings: string[] = [];

  if (env.NODE_ENV !== "development") {
    warnings.push("NODE_ENV should be 'development' in development environment");
  }

  return warnings;
}

/**
 * 根据当前环境验证环境变量
 */
export function validateEnvironmentVariables(
  env: Record<string, string | undefined>,
  environment: Environment
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const rules = environmentValidationRules[environment];

  // Check required and optional variables
  const requiredErrors = checkRequiredVariables(env, rules.required);
  const optionalWarnings = checkOptionalVariables(env, rules.optional);

  let environmentErrors: string[] = [];
  let environmentWarnings: string[] = [];

  // Environment-specific validations
  if (environment === "production" || environment === "staging") {
    const prodValidation = validateProductionEnvironment(env);
    environmentErrors = prodValidation.errors;
    environmentWarnings = prodValidation.warnings;
  } else if (environment === "development") {
    environmentWarnings = validateDevelopmentEnvironment(env);
  }

  const allErrors = [...requiredErrors, ...environmentErrors];
  const allWarnings = [...optionalWarnings, ...environmentWarnings];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * 创建环境特定的模式验证器
 */
export function createEnvironmentSchema(environment: Environment) {
  const baseSchema = z.object({
    NODE_ENV: z.literal(environment),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
    HOST: z.string().optional(),
  });

  switch (environment) {
    case "production":
    case "staging":
      return baseSchema.extend({
        DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
        NEXT_PUBLIC_APP_URL: z
          .string()
          .url("NEXT_PUBLIC_APP_URL must be a valid URL")
          .refine(
            (url) => url.startsWith("https://"),
            "NEXT_PUBLIC_APP_URL must use HTTPS in production"
          ),
        REDIS_URL: z.string().url().optional(),
        SENTRY_DSN: z.string().url().optional(),
        API_BASE_URL: z.string().url().optional(),
      });

    case "development":
      return baseSchema.extend({
        DATABASE_URL: z.string().optional(),
        NEXT_PUBLIC_APP_URL: z.string().url().optional(),
        REDIS_URL: z.string().optional(),
        API_BASE_URL: z.string().url().optional(),
      });

    case "test":
      return baseSchema.extend({
        DATABASE_URL: z.string().optional(),
        NEXT_PUBLIC_APP_URL: z.string().url().optional(),
      });

    default:
      return baseSchema;
  }
}

/**
 * 验证和解析环境变量，并提供详细的错误报告
 */
export function validateAndParseEnv(
  env: Record<string, string | undefined>,
  environment: Environment
) {
  const schema = createEnvironmentSchema(environment);

  try {
    const parsed = schema.parse(env);
    const validation = validateEnvironmentVariables(env, environment);

    return {
      success: true,
      data: parsed,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);

      return {
        success: false,
        data: null,
        errors,
        warnings: [],
      };
    }

    return {
      success: false,
      data: null,
      errors: [error instanceof Error ? error.message : "Unknown validation error"],
      warnings: [],
    };
  }
}

/**
 * 环境配置检查器
 */
export class EnvironmentChecker {
  private environment: Environment;
  private env: Record<string, string | undefined>;

  constructor(environment: Environment, env: Record<string, string | undefined> = process.env) {
    this.environment = environment;
    this.env = env;
  }

  /**
   * 检查所有必需的环境变量是否存在
   */
  public checkRequired(): { isValid: boolean; missing: string[] } {
    const rules = environmentValidationRules[this.environment];
    const missing = rules.required.filter((key) => !this.env[key]);

    return {
      isValid: missing.length === 0,
      missing,
    };
  }

  /**
   * 检查可选的环境变量是否存在
   */
  public checkOptional(): { present: string[]; missing: string[] } {
    const rules = environmentValidationRules[this.environment];
    const present = rules.optional.filter((key) => this.env[key]);
    const missing = rules.optional.filter((key) => !this.env[key]);

    return { present, missing };
  }

  /**
   * 获取完整的验证报告
   */
  public getValidationReport() {
    const validation = validateAndParseEnv(this.env, this.environment);
    const required = this.checkRequired();
    const optional = this.checkOptional();

    return {
      environment: this.environment,
      isValid: validation.success && required.isValid,
      required,
      optional,
      errors: validation.errors,
      warnings: validation.warnings,
      summary: {
        totalRequired: environmentValidationRules[this.environment].required.length,
        requiredPresent:
          environmentValidationRules[this.environment].required.length - required.missing.length,
        totalOptional: environmentValidationRules[this.environment].optional.length,
        optionalPresent: optional.present.length,
      },
    };
  }

  /**
   * 将验证报告打印到控制台
   */
  public printValidationReport(): void {
    const report = this.getValidationReport();

    console.log(`\n🔍 Environment Validation Report (${report.environment})`);
    console.log("=".repeat(50));

    if (report.isValid) {
      console.log("✅ Environment configuration is valid");
    } else {
      console.log("❌ Environment configuration has issues");
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Required: ${report.summary.requiredPresent}/${report.summary.totalRequired}`);
    console.log(`   Optional: ${report.summary.optionalPresent}/${report.summary.totalOptional}`);

    if (report.errors.length > 0) {
      console.log(`\n❌ Errors (${report.errors.length}):`);
      for (const error of report.errors) {
        console.log(`   • ${error}`);
      }
    }

    if (report.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${report.warnings.length}):`);
      for (const warning of report.warnings) {
        console.log(`   • ${warning}`);
      }
    }

    if (report.required.missing.length > 0) {
      console.log(`\n🚫 Missing Required Variables:`);
      for (const key of report.required.missing) {
        console.log(`   • ${key}`);
      }
    }

    if (report.optional.missing.length > 0) {
      console.log(`\n📝 Missing Optional Variables:`);
      for (const key of report.optional.missing) {
        console.log(`   • ${key}`);
      }
    }

    console.log("");
  }
}
