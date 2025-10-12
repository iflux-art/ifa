// Export type definitions from this file
export type AppConfig = {
  name: string;
  version: string;
  environment: "development" | "production" | "test";
};

// 新增异步操作相关类型
export type {
  AsyncOperationResult,
  CacheOptions,
  UseAsyncOptions,
} from "./async-types";
