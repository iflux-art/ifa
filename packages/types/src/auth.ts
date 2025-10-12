/**
 * 用户角色类型
 */
export type UserRole = "admin" | "moderator" | "user" | "guest";

/**
 * 权限类型
 */
export type Permission =
  | "read"
  | "write"
  | "delete"
  | "admin"
  | "moderate"
  | "publish"
  | "manage_users"
  | "manage_content"
  | "manage_settings";

/**
 * 认证提供商类型
 */
export type AuthProvider =
  | "email"
  | "google"
  | "github"
  | "twitter"
  | "facebook"
  | "apple"
  | "microsoft";

/**
 * 用户资料信息
 */
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  dateOfBirth?: string;
  timezone?: string;
  locale?: string;
}

/**
 * 用户账户信息
 */
export interface User extends UserProfile {
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // biome-ignore lint/suspicious/noExplicitAny: 用户元数据可以包含任何类型的数据
  metadata?: Record<string, any>;
}

/**
 * 认证凭据
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 注册数据
 */
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  acceptTerms: boolean;
}

/**
 * 密码重置请求
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * 密码重置数据
 */
export interface PasswordResetData {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * 更改密码数据
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * JWT令牌载荷
 */
export interface JwtPayload {
  sub: string; // 用户ID
  email: string;
  role: UserRole;
  permissions: Permission[];
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

/**
 * 认证令牌
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

/**
 * 认证会话
 */
export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  isAuthenticated: boolean;
  expiresAt: string;
}

/**
 * OAuth提供商配置
 */
export interface OAuthProvider {
  name: AuthProvider;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  enabled: boolean;
}

/**
 * OAuth回调数据
 */
export interface OAuthCallbackData {
  provider: AuthProvider;
  code: string;
  state?: string;
  error?: string;
}

/**
 * 双因素认证设置
 */
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

/**
 * 双因素认证验证
 */
export interface TwoFactorVerification {
  token: string;
  backupCode?: string;
}

/**
 * 账户验证
 */
export interface AccountVerification {
  token: string;
  email?: string;
}

/**
 * 登录尝试跟踪
 */
export interface LoginAttempt {
  id: string;
  userId?: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  timestamp: string;
}

/**
 * 安全设置
 */
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  allowedIpAddresses?: string[];
  trustedDevices: TrustedDevice[];
}

/**
 * 受信任设备信息
 */
export interface TrustedDevice {
  id: string;
  name: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  ipAddress: string;
  lastUsed: string;
  createdAt: string;
}

/**
 * 账户活动日志
 */
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  // biome-ignore lint/suspicious/noExplicitAny: 活动元数据可以包含任何类型的数据
  metadata?: Record<string, any>;
  timestamp: string;
}
