# 代码风格和架构模式指南 (Code Style and Architecture Patterns Guide)

## 概述 (Overview)

本指南定义了 monorepo 中所有应用的统一代码风格和架构模式，确保代码的一致性、可读性和可维护性。

## TypeScript 编码规范 (TypeScript Coding Standards)

### 类型定义规范 (Type Definition Standards)

#### 接口命名 (Interface Naming)
```typescript
// ✅ 正确：使用 PascalCase，描述性命名
interface UserProfile {
  id: string
  name: string
  email: string
}

interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// ❌ 错误：使用 I 前缀或不清晰的命名
interface IUser { }
interface Data { }
```

#### 类型别名 (Type Aliases)
```typescript
// ✅ 正确：使用 PascalCase，清晰的类型定义
type Status = 'pending' | 'approved' | 'rejected'
type EventHandler<T> = (event: T) => void
type ApiEndpoint = `/api/${string}`

// ❌ 错误：不清晰的类型定义
type T = string | number
type Handler = (x: any) => void
```

#### 泛型约束 (Generic Constraints)
```typescript
// ✅ 正确：有意义的泛型参数名和约束
interface Repository<TEntity extends { id: string }> {
  findById(id: string): Promise<TEntity | null>
  save(entity: TEntity): Promise<TEntity>
}

// ✅ 正确：复杂泛型的清晰命名
type ApiHandler<
  TRequest extends Record<string, unknown>,
  TResponse extends Record<string, unknown>
> = (request: TRequest) => Promise<TResponse>

// ❌ 错误：无意义的泛型参数名
interface Repo<T, U, V> { }
```

### 函数定义规范 (Function Definition Standards)

#### 函数签名 (Function Signatures)
```typescript
// ✅ 正确：清晰的参数类型和返回类型
async function fetchUserProfile(
  userId: string,
  options?: {
    includePreferences?: boolean
    timeout?: number
  }
): Promise<UserProfile | null> {
  // 实现
}

// ✅ 正确：使用函数重载处理不同参数类型
function formatDate(date: Date): string
function formatDate(date: string, format: string): string
function formatDate(date: Date | string, format?: string): string {
  // 实现
}

// ❌ 错误：使用 any 类型或不清晰的参数
async function fetchData(id: any): Promise<any> { }
```

#### 错误处理 (Error Handling)
```typescript
// ✅ 正确：自定义错误类型
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// ✅ 正确：Result 模式处理错误
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await apiCall()
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    }
  }
}
```

## React 组件规范 (React Component Standards)

### 组件结构模式 (Component Structure Patterns)

#### 基础组件模式 (Basic Component Pattern)
```typescript
import React from 'react'
import { cn } from '@/lib/utils'

// ✅ 正确：清晰的 Props 接口定义
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  onClick?: () => void
}

// ✅ 正确：使用 forwardRef 支持 ref 传递
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', disabled, className, onClick }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

#### 复合组件模式 (Compound Component Pattern)
```typescript
// ✅ 正确：复合组件设计
interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

function CardRoot({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      {children}
    </div>
  )
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  )
}

function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

// 导出复合组件
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
})

// 使用示例
// <Card>
//   <Card.Header>Header content</Card.Header>
//   <Card.Content>Main content</Card.Content>
// </Card>
```

#### Hooks 组件模式 (Hooks Component Pattern)
```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'

// ✅ 正确：自定义 Hook 设计
interface UseApiOptions<T> {
  initialData?: T
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { initialData = null, enabled = true, onSuccess, onError } = options
  
  const [data, setData] = useState<T | null>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [apiCall, enabled, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// 使用示例组件
interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  const { data: user, loading, error, refetch } = useApi(
    () => fetchUserProfile(userId),
    {
      enabled: !!userId,
      onError: (error) => console.error('Failed to fetch user:', error),
    }
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

### 状态管理模式 (State Management Patterns)

#### Zustand Store 设计 (Zustand Store Design)
```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

// ✅ 正确：清晰的状态和动作分离
interface UserState {
  currentUser: User | null
  users: User[]
  loading: boolean
  error: string | null
}

interface UserActions {
  // 查询动作
  fetchUsers: () => Promise<void>
  fetchUserById: (id: string) => Promise<void>
  
  // 修改动作
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  
  // 本地状态动作
  setCurrentUser: (user: User | null) => void
  clearError: () => void
  reset: () => void
}

type UserStore = UserState & UserActions

const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
}

export const useUserStore = create<UserStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // 异步动作
      fetchUsers: async () => {
        set((state) => {
          state.loading = true
          state.error = null
        })

        try {
          const users = await apiClient.get<User[]>('/users')
          set((state) => {
            state.users = users
            state.loading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Unknown error'
            state.loading = false
          })
        }
      },

      updateUser: async (id: string, updates: Partial<User>) => {
        try {
          const updatedUser = await apiClient.patch<User>(`/users/${id}`, updates)
          set((state) => {
            const index = state.users.findIndex(user => user.id === id)
            if (index !== -1) {
              state.users[index] = updatedUser
            }
            if (state.currentUser?.id === id) {
              state.currentUser = updatedUser
            }
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Update failed'
          })
        }
      },

      // 同步动作
      setCurrentUser: (user) => set((state) => {
        state.currentUser = user
      }),

      clearError: () => set((state) => {
        state.error = null
      }),

      reset: () => set(() => initialState),
    })),
    { name: 'user-store' }
  )
)

// ✅ 正确：选择器 Hooks
export const useCurrentUser = () => useUserStore(state => state.currentUser)
export const useUsers = () => useUserStore(state => state.users)
export const useUserLoading = () => useUserStore(state => state.loading)
export const useUserError = () => useUserStore(state => state.error)
```

## API 设计模式 (API Design Patterns)

### API 客户端设计 (API Client Design)
```typescript
// ✅ 正确：类型安全的 API 客户端
class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL.replace(/\/$/, '')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        endpoint
      )
    }

    return response.json()
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint
    
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// 自定义错误类
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 导出配置好的实例
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  {
    'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
  }
)
```

### API 路由设计 (API Route Design)
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ✅ 正确：输入验证 Schema
const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional(),
})

const UpdateUserSchema = CreateUserSchema.partial()

// ✅ 正确：统一的响应格式
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: unknown
  }
}

function createResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

function createErrorResponse(
  message: string,
  code: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { 
      success: false, 
      error: { message, code, details } 
    },
    { status }
  )
}

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10

    const users = await getUsersPaginated({ page, limit })
    return createResponse(users)
  } catch (error) {
    console.error('GET /api/users error:', error)
    return createErrorResponse(
      'Failed to fetch users',
      'FETCH_USERS_ERROR',
      500
    )
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 输入验证
    const validationResult = CreateUserSchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid input data',
        'VALIDATION_ERROR',
        400,
        validationResult.error.errors
      )
    }

    const user = await createUser(validationResult.data)
    return createResponse(user, 201)
  } catch (error) {
    console.error('POST /api/users error:', error)
    return createErrorResponse(
      'Failed to create user',
      'CREATE_USER_ERROR',
      500
    )
  }
}
```

## 样式和主题规范 (Styling and Theme Standards)

### Tailwind CSS 使用规范 (Tailwind CSS Usage Standards)
```typescript
// ✅ 正确：使用 cn 工具函数组合类名
import { cn } from '@/lib/utils'

interface ComponentProps {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Component({ variant = 'default', size = 'md', className }: ComponentProps) {
  return (
    <div
      className={cn(
        // 基础样式
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // 变体样式
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
          'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        },
        
        // 尺寸样式
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        
        // 自定义样式
        className
      )}
    >
      {/* 内容 */}
    </div>
  )
}

// ❌ 错误：硬编码长类名字符串
export function BadComponent() {
  return (
    <div className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4">
      {/* 内容 */}
    </div>
  )
}
```

### CSS 变量和主题 (CSS Variables and Theming)
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* 基础颜色 */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    /* 主要颜色 */
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    
    /* 次要颜色 */
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    
    /* 强调色 */
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    
    /* 边框和输入 */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    
    /* 圆角 */
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer components {
  /* 自定义组件样式 */
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring;
    @apply disabled:pointer-events-none disabled:opacity-50;
  }
  
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
}
```

## 测试规范 (Testing Standards)

### 单元测试模式 (Unit Testing Patterns)
```typescript
// components/ui/button/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  // ✅ 正确：描述性测试名称
  it('renders with correct text content', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50')
  })

  // ✅ 正确：测试可访问性
  it('has proper accessibility attributes', () => {
    render(<Button aria-label="Custom label">Icon only</Button>)
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument()
  })
})
```

### 集成测试模式 (Integration Testing Patterns)
```typescript
// hooks/use-api.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useApi } from './use-api'

// Mock API 调用
const mockApiCall = vi.fn()

describe('useApi', () => {
  beforeEach(() => {
    mockApiCall.mockClear()
  })

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test User' }
    mockApiCall.mockResolvedValue(mockData)

    const { result } = renderHook(() => useApi(mockApiCall))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
    expect(mockApiCall).toHaveBeenCalledTimes(1)
  })

  it('handles API errors correctly', async () => {
    const mockError = new Error('API Error')
    mockApiCall.mockRejectedValue(mockError)

    const { result } = renderHook(() => useApi(mockApiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toEqual(mockError)
  })

  it('can refetch data', async () => {
    const mockData = { id: 1, name: 'Test User' }
    mockApiCall.mockResolvedValue(mockData)

    const { result } = renderHook(() => useApi(mockApiCall))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // 重新获取数据
    await result.current.refetch()

    expect(mockApiCall).toHaveBeenCalledTimes(2)
  })
})
```

## 性能优化模式 (Performance Optimization Patterns)

### 组件优化 (Component Optimization)
```typescript
import { memo, useMemo, useCallback } from 'react'

// ✅ 正确：使用 memo 优化纯组件
interface ExpensiveComponentProps {
  data: ComplexData[]
  onItemClick: (id: string) => void
}

export const ExpensiveComponent = memo<ExpensiveComponentProps>(
  ({ data, onItemClick }) => {
    // ✅ 正确：使用 useMemo 缓存计算结果
    const processedData = useMemo(() => {
      return data.map(item => ({
        ...item,
        displayName: `${item.firstName} ${item.lastName}`,
        isActive: item.status === 'active',
      }))
    }, [data])

    // ✅ 正确：使用 useCallback 缓存事件处理器
    const handleItemClick = useCallback((id: string) => {
      onItemClick(id)
    }, [onItemClick])

    return (
      <div>
        {processedData.map(item => (
          <ExpensiveItem
            key={item.id}
            item={item}
            onClick={handleItemClick}
          />
        ))}
      </div>
    )
  }
)

ExpensiveComponent.displayName = 'ExpensiveComponent'
```

### 懒加载模式 (Lazy Loading Patterns)
```typescript
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'

// ✅ 正确：组件懒加载
const LazyDashboard = lazy(() => import('./dashboard'))
const LazySettings = lazy(() => import('./settings'))

// ✅ 正确：带错误边界的懒加载
export function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingSpinner />}>
        <Router>
          <Routes>
            <Route path="/dashboard" element={<LazyDashboard />} />
            <Route path="/settings" element={<LazySettings />} />
          </Routes>
        </Router>
      </Suspense>
    </ErrorBoundary>
  )
}

// ✅ 正确：动态导入工具函数
export async function loadUtility() {
  const { heavyUtility } = await import('@/lib/heavy-utility')
  return heavyUtility
}
```

## 安全规范 (Security Standards)

### 输入验证和清理 (Input Validation and Sanitization)
```typescript
import { z } from 'zod'
import DOMPurify from 'dompurify'

// ✅ 正确：严格的输入验证
const UserInputSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name contains invalid characters'),
  
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  
  age: z.number()
    .int('Age must be an integer')
    .min(0, 'Age cannot be negative')
    .max(150, 'Age seems unrealistic'),
  
  bio: z.string()
    .max(500, 'Bio too long')
    .optional(),
})

// ✅ 正确：HTML 内容清理
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  })
}

// ✅ 正确：安全的 API 处理
export async function createUser(input: unknown) {
  // 验证输入
  const validatedInput = UserInputSchema.parse(input)
  
  // 清理 HTML 内容
  if (validatedInput.bio) {
    validatedInput.bio = sanitizeHtml(validatedInput.bio)
  }
  
  // 创建用户
  return await userRepository.create(validatedInput)
}
```

### 环境变量和配置安全 (Environment Variables and Configuration Security)
```typescript
// config/env.ts
import { z } from 'zod'

// ✅ 正确：环境变量验证
const EnvSchema = z.object({
  // 公开变量（客户端可访问）
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // 服务端变量（仅服务端可访问）
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_KEY: z.string().min(1),
  
  // 可选变量
  REDIS_URL: z.string().url().optional(),
  
  // 环境类型
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// 验证环境变量
function validateEnv() {
  try {
    return EnvSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    process.exit(1)
  }
}

export const env = validateEnv()

// ✅ 正确：类型安全的环境变量访问
export function getPublicConfig() {
  return {
    appName: env.NEXT_PUBLIC_APP_NAME,
    appUrl: env.NEXT_PUBLIC_APP_URL,
  }
}

// ❌ 错误：直接访问 process.env
// const apiKey = process.env.API_KEY // 可能是 undefined
```

## 文档和注释规范 (Documentation and Comments Standards)

### JSDoc 注释规范 (JSDoc Comments Standards)
```typescript
/**
 * 用户配置文件管理工具类
 * 提供用户数据的 CRUD 操作和验证功能
 * 
 * @example
 * ```typescript
 * const userManager = new UserManager(apiClient)
 * const user = await userManager.getUserById('123')
 * ```
 */
export class UserManager {
  private apiClient: ApiClient

  /**
   * 创建用户管理器实例
   * 
   * @param apiClient - API 客户端实例
   */
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  /**
   * 根据 ID 获取用户信息
   * 
   * @param userId - 用户唯一标识符
   * @returns Promise 包含用户信息，如果用户不存在则返回 null
   * 
   * @throws {ApiError} 当 API 请求失败时抛出
   * 
   * @example
   * ```typescript
   * const user = await userManager.getUserById('user-123')
   * if (user) {
   *   console.log(user.name)
   * }
   * ```
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.apiClient.get<User>(`/users/${userId}`)
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * 更新用户信息
   * 
   * @param userId - 用户 ID
   * @param updates - 要更新的用户字段
   * @returns 更新后的用户信息
   * 
   * @throws {ValidationError} 当输入数据无效时抛出
   * @throws {ApiError} 当 API 请求失败时抛出
   */
  async updateUser(
    userId: string, 
    updates: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<User> {
    // 实现...
  }
}
```

### README 文档模板 (README Template)
```markdown
# 应用名称

简短描述应用的主要功能和用途。

## 功能特性

- ✨ 功能 1：详细描述
- 🚀 功能 2：详细描述
- 🔒 功能 3：详细描述

## 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **测试**: Vitest + Playwright
- **代码质量**: Biome

## 快速开始

### 环境要求

- Node.js 22.x
- pnpm 9.15.9

### 安装依赖

```bash
pnpm install
```

### 环境配置

复制环境变量模板并填写必要的配置：

```bash
cp .env.example .env.local
```

### 开发模式

```bash
pnpm dev
```

应用将在 http://localhost:3000 启动。

### 构建部署

```bash
pnpm build
pnpm start
```

## 项目结构

```
src/
├── app/          # Next.js 页面和路由
├── components/   # React 组件
├── lib/          # 工具函数和配置
├── hooks/        # 自定义 Hooks
├── stores/       # 状态管理
├── types/        # TypeScript 类型
└── config/       # 应用配置
```

## 开发指南

### 代码规范

项目使用 Biome 进行代码格式化和 lint：

```bash
pnpm check      # 检查代码质量
pnpm format     # 格式化代码
```

### 测试

```bash
pnpm test           # 运行单元测试
pnpm test:e2e       # 运行 E2E 测试
pnpm test:coverage  # 生成测试覆盖率报告
```

### 类型检查

```bash
pnpm type-check
```

## 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 其他平台

应用支持部署到任何支持 Node.js 的平台。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License
```

---

本指南将随着项目发展持续更新。遵循这些规范有助于保持代码库的一致性和可维护性。