/**
 * 应用常量定义
 * 统一管理应用中使用的常量值，避免魔法字符串和重复定义
 */

/**
 * 应用基础常量
 */
export const APP_CONSTANTS = {
  // 应用信息
  NAME: "Hub",
  VERSION: "1.0.0",
  DESCRIPTION: "网址导航中心应用",

  // 默认配置
  DEFAULT_LANGUAGE: "zh-CN",
  DEFAULT_THEME: "dark",

  // 分页配置
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // 缓存配置
  CACHE_TTL: 5 * 60 * 1000, // 5分钟
  MAX_CACHE_SIZE: 100,
} as const;

/**
 * 路由常量
 */
export const ROUTES = {
  // 公共路由
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",

  // 管理路由
  ADMIN: "/admin",
  ADMIN_LINKS: "/admin/links",
  ADMIN_USERS: "/admin/users",

  // API路由
  API_LINKS: "/api/links",
  API_CATEGORIES: "/api/categories",
  API_UPLOAD: "/api/upload",
} as const;

/**
 * 存储键常量
 */
export const STORAGE_KEYS = {
  // LocalStorage 键
  THEME: "hub-theme",
  LANGUAGE: "hub-language",
  SIDEBAR_STATE: "hub-sidebar-state",
  FILTER_STATE: "hub-filter-state",

  // SessionStorage 键
  SEARCH_HISTORY: "hub-search-history",
  FORM_DRAFT: "hub-form-draft",
} as const;

/**
 * 事件名称常量
 */
export const EVENTS = {
  // 自定义事件
  THEME_CHANGED: "hub:theme-changed",
  LANGUAGE_CHANGED: "hub:language-changed",
  SIDEBAR_TOGGLED: "hub:sidebar-toggled",

  // 数据事件
  LINKS_UPDATED: "hub:links-updated",
  CATEGORIES_UPDATED: "hub:categories-updated",

  // 错误事件
  CHUNK_LOAD_ERROR: "hub:chunk-load-error",
  API_ERROR: "hub:api-error",
} as const;

/**
 * CSS 类名常量
 */
export const CSS_CLASSES = {
  // 布局类
  CONTAINER: "container mx-auto px-4",
  GRID_RESPONSIVE: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  FLEX_CENTER: "flex items-center justify-center",

  // 状态类
  LOADING: "animate-pulse",
  ERROR: "text-destructive",
  SUCCESS: "text-green-600",

  // 交互类
  BUTTON_PRIMARY: "bg-primary text-primary-foreground hover:bg-primary/90",
  BUTTON_SECONDARY: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
} as const;

/**
 * 验证规则常量
 */
export const VALIDATION = {
  // 字符串长度限制
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 0,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_URL_LENGTH: 1,
  MAX_URL_LENGTH: 2000,

  // 文件上传限制
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],

  // 正则表达式
  URL_PATTERN: /^https?:\/\/.+/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * 错误消息常量
 */
export const ERROR_MESSAGES = {
  // 通用错误
  UNKNOWN_ERROR: "发生未知错误",
  NETWORK_ERROR: "网络连接错误",
  TIMEOUT_ERROR: "请求超时",

  // 认证错误
  UNAUTHORIZED: "未授权访问",
  FORBIDDEN: "禁止访问",
  SESSION_EXPIRED: "会话已过期",

  // 验证错误
  REQUIRED_FIELD: "此字段为必填项",
  INVALID_URL: "请输入有效的URL",
  INVALID_EMAIL: "请输入有效的邮箱地址",
  FILE_TOO_LARGE: "文件大小超出限制",
  INVALID_FILE_TYPE: "不支持的文件类型",

  // 数据错误
  ITEM_NOT_FOUND: "项目不存在",
  DUPLICATE_ITEM: "项目已存在",
  DELETE_FAILED: "删除失败",
  UPDATE_FAILED: "更新失败",
} as const;

/**
 * 成功消息常量
 */
export const SUCCESS_MESSAGES = {
  // 数据操作
  ITEM_CREATED: "创建成功",
  ITEM_UPDATED: "更新成功",
  ITEM_DELETED: "删除成功",

  // 文件操作
  FILE_UPLOADED: "文件上传成功",
  FILE_DELETED: "文件删除成功",

  // 用户操作
  PROFILE_UPDATED: "个人资料更新成功",
  PASSWORD_CHANGED: "密码修改成功",
} as const;

/**
 * 时间常量
 */
export const TIME_CONSTANTS = {
  // 毫秒
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,

  // 防抖延迟
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_RESIZE: 100,
  DEBOUNCE_SCROLL: 50,

  // 动画持续时间
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
} as const;

/**
 * 断点常量
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

/**
 * 图标大小常量
 */
export const ICON_SIZES = {
  XS: "h-3 w-3",
  SM: "h-4 w-4",
  MD: "h-5 w-5",
  LG: "h-6 w-6",
  XL: "h-8 w-8",
} as const;
