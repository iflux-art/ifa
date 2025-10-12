# @repo/types

单体仓库的共享 TypeScript 类型定义。

## 特性

- **API 类型**: 请求/响应接口、分页、错误处理
- **配置类型**: 应用配置、功能标志、环境变量
- **UI 类型**: 组件属性、主题配置、表单定义
- **认证类型**: 用户管理、JWT 令牌、OAuth 提供商
- **数据库类型**: 查询构建器、迁移、模式定义

## 用法

```typescript
// 导入特定类型模块
import type { ApiResponse, PaginatedResponse } from '@repo/types/api'
import type { AppConfig, FeatureFlags } from '@repo/types/config'
import type { User, AuthSession } from '@repo/types/auth'

// 或从主入口导入
import type { 
  ApiResponse, 
  User, 
  AppConfig 
} from '@repo/types'

// 在组件中使用
interface UserListProps {
  users: PaginatedResponse<User>
  onUserSelect: (user: User) => void
}

// 在 API 函数中使用
async function fetchUsers(): Promise<ApiResponse<User[]>> {
  // Implementation
}

// 在配置中使用
const config: AppConfig = {
  name: 'My App',
  version: '1.0.0',
  environment: 'production',
  // ... other config
}
```

## 类型分类

### API 类型 (`@repo/types/api`)
- `ApiResponse<T>` - 标准 API 响应包装器
- `PaginatedResponse<T>` - 分页数据响应
- `ApiError` - 错误响应结构
- `SearchParams` - 用于过滤/排序的查询参数

### 配置类型 (`@repo/types/config`)
- `AppConfig` - 应用配置
- `FeatureFlags` - 功能切换定义
- `DatabaseConfig` - 数据库连接设置
- `AuthConfig` - 认证设置

### UI 类型 (`@repo/types/ui`)
- `BaseComponentProps` - 通用组件属性
- `FormField` - 表单字段配置
- `TableColumn<T>` - 表格列定义
- `ThemeConfig` - 主题定制

### 认证类型 (`@repo/types/auth`)
- `User` - 用户资料和账户数据
- `AuthSession` - 认证会话
- `LoginCredentials` - 登录表单数据
- `JwtPayload` - JWT 令牌结构

### 数据库类型 (`@repo/types/database`)
- `QueryOptions` - 数据库查询参数
- `Migration` - 数据库迁移定义
- `TableDefinition` - 模式表结构
- `AuditLogEntry` - 审计跟踪记录

## 开发

```bash
# 构建包
pnpm build

# 监听变化
pnpm dev

# 类型检查
pnpm type-check
```