# @repo/ui

单体仓库的共享UI组件和钩子。

## 组件

- **Button**: 多功能按钮组件，具有多种变体和尺寸
- **Card**: 用于内容组织的卡片组件
- **Input**: 具有一致样式的表单输入组件

## 钩子

- **useLocalStorage**: 用于管理localStorage状态的钩子
- **useMediaQuery**: 用于媒体查询的响应式设计钩子
- **useDebounce**: 用于防抖值的钩子

## 用法

```tsx
import { Button, Card, Input } from '@repo/ui'
import { useLocalStorage, useMediaQuery } from '@repo/ui/hooks'

function MyComponent() {
  const [value, setValue] = useLocalStorage('key', 'default')
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <Card>
      <Input placeholder="Enter value..." />
      <Button variant="default">Submit</Button>
    </Card>
  )
}
```

## 开发

```bash
# 构建包
pnpm build

# 监听变化
pnpm dev

# 运行测试
pnpm test

# 类型检查
pnpm type-check
```