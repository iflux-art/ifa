/**
 * 简化版API工具函数
 * 提供轻量级的API请求和错误处理功能
 */

import { NextResponse } from "next/server";

/**
 * API 错误类型
 */
export type ApiErrorType =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "RATE_LIMIT"
  | "INVALID_METHOD";

/**
 * API 错误响应接口
 */
export interface ApiErrorResponse {
  error: string;
  code: ApiErrorType;
  details?: string;
  timestamp: string;
}

/**
 * API 成功响应接口
 */
export interface ApiSuccessResponse<T = unknown> {
  data: T;
  timestamp: string;
  total?: number;
}

/**
 * API请求选项
 */
interface ApiRequestOptions {
  /** 请求方法 */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体 */
  body?: unknown;
  /** 查询参数 */
  params?: Record<string, string | number | boolean>;
}

/**
 * 发送API请求
 *
 * @param url - 请求URL
 * @param options - 请求选项
 * @returns Promise<T>
 */
export async function apiRequest<T>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", headers = {}, body, params } = options;

  // 构建完整URL
  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  // 构建请求选项
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * 标准化 API 错误响应
 */
export function createApiError(
  type: ApiErrorType,
  message: string,
  details?: string,
  status = 500,
): NextResponse<ApiErrorResponse> {
  const errorResponse: ApiErrorResponse = {
    error: message,
    code: type,
    details,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * 标准化 API 成功响应
 */
export function createApiSuccess<T>(
  data: T,
  total?: number,
): NextResponse<ApiSuccessResponse<T>> {
  const successResponse: ApiSuccessResponse<T> = {
    data,
    timestamp: new Date().toISOString(),
    ...(total !== undefined && { total }),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, max-age=0",
  };

  return NextResponse.json(successResponse, { headers });
}

/**
 * 常用的错误创建函数
 */
export const ApiErrors = {
  validation: (message: string, details?: string) =>
    createApiError("VALIDATION_ERROR", message, details, 400),

  notFound: (resource = "Resource") =>
    createApiError("NOT_FOUND", `${resource} not found`, undefined, 404),

  unauthorized: (message = "Unauthorized access") =>
    createApiError("UNAUTHORIZED", message, undefined, 401),

  forbidden: (message = "Access forbidden") =>
    createApiError("FORBIDDEN", message, undefined, 403),

  conflict: (message: string, details?: string) =>
    createApiError("CONFLICT", message, details, 409),

  internal: (message = "Internal server error", details?: string) =>
    createApiError("INTERNAL_ERROR", message, details, 500),

  rateLimit: (message = "Too many requests") =>
    createApiError("RATE_LIMIT", message, undefined, 429),

  invalidMethod: (allowedMethods: string[]) =>
    createApiError(
      "INVALID_METHOD",
      `Method not allowed. Allowed methods: ${allowedMethods.join(", ")}`,
      undefined,
      405,
    ),
};
