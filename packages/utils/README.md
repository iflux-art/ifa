# @repo/utils

单体仓库的共享工具函数，支持TypeScript和树摇优化。

## Features

- **类名工具**: `cn()` 用于合并Tailwind类
- **数组工具**: `uniqueBy()`, `groupBy()`, `chunk()`, `moveArrayItem()`
- **函数工具**: `debounce()`, `throttle()`, `memoize()`, `compose()`, `pipe()`
- **日期工具**: `formatDate()`, `getRelativeTime()`, `isToday()`, `addDays()`
- **对象工具**: `deepClone()`, `deepMerge()`, `get()`, `set()`, `omit()`, `pick()`
- **字符串工具**: `capitalize()`, `camelCase()`, `kebabCase()`, `truncate()`
- **验证工具**: `isValidEmail()`, `isValidUrl()`, `validatePassword()`
- **错误处理**: 自定义错误类和安全执行包装器
- **异步工具**: `sleep()`, `withTimeout()`, `batchAsync()`, `retryWithBackoff()`
- **TypeScript类型**: 高级工具类型以获得更好的类型安全

## 用法

```typescript
// 导入特定工具（支持树摇优化）
import { cn } from '@repo/utils/cn'
import { debounce } from '@repo/utils/function'
import { formatDate } from '@repo/utils/date'

// 或从主入口导入
import { cn, debounce, formatDate } from '@repo/utils'

// 类名合并
const className = cn('px-4 py-2', 'bg-blue-500', { 'text-white': isActive })

// 防抖函数
const debouncedSearch = debounce((query: string) => {
  // Search logic
}, 300)

// 日期格式化
const formatted = formatDate(new Date(), { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
})
```. 

## 在此单体仓库中的用法

此包在此单体仓库项目内部使用。通过pnpm工作区设置，这些工具函数对单体仓库中的所有应用自动可用。

## 开发

### 构建

```bash
pnpm build
```

### 测试

```bash
pnpm test
pnpm test:watch
```

### 代码检查和格式化

```bash
pnpm lint
pnpm format
pnpm check
```

## 特性

- **类型安全**: 完整的TypeScript支持和适当的类型定义
- **支持树摇**: 仅导入所需内容
- **经过充分测试**: 全面的测试覆盖
- **性能优化**: 高效的实现
- **零依赖**: 最少的外部依赖（仅类名使用clsx）
- **一致的API**: 可预测的函数签名和行为