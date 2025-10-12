/**
 * 应用程序错误的自定义错误类
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = "GENERIC_ERROR",
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 验证错误的自定义错误类
 */
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    this.field = field;
  }
}

/**
 * 未找到错误的自定义错误类
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

/**
 * 安全地执行函数并返回结果或错误
 * @param fn - 要执行的函数
 * @returns [错误, 结果]的元组
 */
export async function safeAsync<T, E = Error>(fn: () => Promise<T>): Promise<[E | null, T | null]> {
  try {
    const result = await fn();
    return [null, result];
  } catch (error) {
    return [error as E, null];
  }
}

/**
 * 安全地执行同步函数并返回结果或错误
 * @param fn - 要执行的函数
 * @returns [错误, 结果]的元组
 */
export function safe<T, E = Error>(fn: () => T): [E | null, T | null] {
  try {
    const result = fn();
    return [null, result];
  } catch (error) {
    return [error as E, null];
  }
}

/**
 * 为异步函数创建重试包装器
 * @param fn - 要重试的异步函数
 * @param maxRetries - 最大重试次数
 * @param delay - 重试之间的延迟毫秒数
 * @returns 失败时重试的函数
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型数组类型需要any
export function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  delay: number = 1000
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        // 重试前等待
        await new Promise((resolve) => setTimeout(resolve, delay * 2 ** attempt));
      }
    }

    throw lastError || new Error("重试失败，出现未知错误");
  };
}
