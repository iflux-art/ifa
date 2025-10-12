/**
 * 数据库连接状态
 */
export type ConnectionStatus = "connected" | "connecting" | "disconnected" | "error";

/**
 * 数据库查询操作符
 */
export type QueryOperator =
  | "eq" // 等于
  | "ne" // 不等于
  | "gt" // 大于
  | "gte" // 大于等于
  | "lt" // 小于
  | "lte" // 小于等于
  | "in" // 在数组中
  | "nin" // 不在数组中
  | "like" // 类似 (SQL)
  | "ilike" // 不区分大小写的类似
  | "regex" // 正则表达式
  | "exists" // 字段存在
  | "null" // 为空
  | "not_null"; // 不为空

/**
 * 数据库查询条件
 */
export interface QueryCondition {
  field: string;
  operator: QueryOperator;
  // biome-ignore lint/suspicious/noExplicitAny: 查询值可以是任何类型
  value: any;
}

/**
 * 数据库查询选项
 */
export interface QueryOptions {
  select?: string[];
  where?: QueryCondition[];
  orderBy?: Array<{
    field: string;
    direction: "asc" | "desc";
  }>;
  limit?: number;
  offset?: number;
  include?: string[];
  groupBy?: string[];
  having?: QueryCondition[];
}

/**
 * 数据库事务选项
 */
export interface TransactionOptions {
  isolationLevel?: "read_uncommitted" | "read_committed" | "repeatable_read" | "serializable";
  timeout?: number;
  readOnly?: boolean;
}

/**
 * 数据库迁移信息
 */
export interface Migration {
  id: string;
  name: string;
  version: string;
  description?: string;
  up: string;
  down: string;
  appliedAt?: string;
  checksum: string;
}

/**
 * 数据库模式列定义
 */
export interface ColumnDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "json" | "text" | "uuid" | "enum";
  length?: number;
  precision?: number;
  scale?: number;
  nullable?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: 默认值可以是任何类型
  defaultValue?: any;
  primaryKey?: boolean;
  unique?: boolean;
  index?: boolean;
  foreignKey?: {
    table: string;
    column: string;
    onDelete?: "cascade" | "set_null" | "restrict";
    onUpdate?: "cascade" | "set_null" | "restrict";
  };
  enumValues?: string[];
}

/**
 * 数据库表定义
 */
export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  indexes?: Array<{
    name: string;
    columns: string[];
    unique?: boolean;
    type?: "btree" | "hash" | "gin" | "gist";
  }>;
  constraints?: Array<{
    name: string;
    type: "check" | "unique" | "foreign_key";
    definition: string;
  }>;
}

/**
 * 数据库连接池配置
 */
export interface PoolConfig {
  min: number;
  max: number;
  acquireTimeoutMillis: number;
  createTimeoutMillis: number;
  destroyTimeoutMillis: number;
  idleTimeoutMillis: number;
  reapIntervalMillis: number;
  createRetryIntervalMillis: number;
}

/**
 * 数据库备份配置
 */
export interface BackupConfig {
  enabled: boolean;
  schedule: string; // cron 表达式
  retention: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  compression: boolean;
  encryption?: {
    enabled: boolean;
    key: string;
  };
  storage: {
    type: "local" | "s3" | "gcs";
    path: string;
    credentials?: Record<string, string>;
  };
}

/**
 * 数据库性能指标
 */
export interface DatabaseMetrics {
  connections: {
    active: number;
    idle: number;
    total: number;
  };
  queries: {
    total: number;
    slow: number;
    failed: number;
    averageTime: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  storage: {
    size: number;
    freeSpace: number;
    usedSpace: number;
  };
}

/**
 * 数据库审计日志条目
 */
export interface AuditLogEntry {
  id: string;
  table: string;
  operation: "insert" | "update" | "delete";
  recordId: string;
  userId?: string;
  // biome-ignore lint/suspicious/noExplicitAny: 数据库值可以是任何类型
  oldValues?: Record<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: 数据库值可以是任何类型
  newValues?: Record<string, any>;
  timestamp: string;
  // biome-ignore lint/suspicious/noExplicitAny: 审计元数据可以包含任何类型的数据
  metadata?: Record<string, any>;
}

/**
 * 数据库种子数据
 */
export interface SeedData {
  table: string;
  // biome-ignore lint/suspicious/noExplicitAny: 种子数据可以包含任何类型的值
  data: Record<string, any>[];
  truncate?: boolean;
  updateOnConflict?: boolean;
}

/**
 * 数据库健康检查结果
 */
export interface HealthCheck {
  status: "healthy" | "unhealthy" | "degraded";
  responseTime: number;
  connections: {
    active: number;
    max: number;
  };
  lastError?: string;
  timestamp: string;
}
