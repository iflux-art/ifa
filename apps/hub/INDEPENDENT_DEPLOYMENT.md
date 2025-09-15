# 独立部署指南

本文档说明了如何将 `hub` 应用从 monorepo 中独立部署，而无需下载整个项目。

## 为什么需要独立部署？

在某些情况下，用户可能只想使用项目中的某个特定应用，而不是整个 monorepo。通过独立部署，用户可以：

1. 只下载需要的应用代码
2. 减少项目体积和依赖数量
3. 简化部署流程

## 独立部署的实现方式

### 方式一：使用已发布的 npm 包（推荐）

项目中的共享包已经发布到 npm，用户可以直接安装使用：

- `@repo/ui` → `@iflux-art/ui`
- `@repo/utils` → `@iflux-art/utils`
- `@repo/tailwind-config` → `@iflux-art/tailwind-config`
- `@repo/typescript-config` → `@iflux-art/typescript-config`

修改应用的 package.json，将 `workspace:*` 依赖替换为实际版本号：
```json
{
  "dependencies": {
    "@iflux-art/ui": "^1.0.0",
    "@iflux-art/utils": "^1.0.0"
  },
  "devDependencies": {
    "@iflux-art/tailwind-config": "^1.0.0",
    "@iflux-art/typescript-config": "^1.0.0"
  }
}
```

### 方式二：内联共享代码

1. 将共享包的源代码复制到应用目录中
2. 修改导入路径，直接引用本地文件
3. 移除对 workspace 包的依赖

## 一键独立部署（推荐）

为了简化独立部署过程，我们提供了一键独立部署功能：

1. 下载或克隆 [apps/hub](file://c:\project\ifa\apps\hub) 目录
2. 运行应用目录中的独立部署脚本：
   ```bash
   cd apps/hub
   node setup-standalone.js
   ```
3. 安装依赖并运行应用：
   ```bash
   pnpm install
   pnpm dev
   ```

该脚本会自动：
- 将 workspace 依赖替换为 npm 包依赖
- 更新配置文件以适应独立部署
- 清理缓存文件

## 独立部署步骤

### 使用 npm 包（推荐）

1. 克隆或下载 [apps/hub](file://c:\project\ifa\apps\hub) 目录
2. 运行独立部署脚本：`node setup-standalone.js`
3. 运行 `pnpm install` 安装依赖
4. 运行 `pnpm build` 构建应用
5. 运行 `pnpm start` 启动应用

### 手动复制代码

1. 克隆或下载 [apps/hub](file://c:\project\ifa\apps\hub) 目录
2. 复制根目录的配置文件到应用目录：
   - `.gitignore`
   - `biome.json`
3. 根据选择的部署方式调整 package.json
4. 复制共享组件和工具函数：
   - 从 `packages/ui/src` 复制需要的组件到 [apps/hub/src/components/ui](file://c:\project\ifa\apps\hub\src\components\ui)
   - 从 `packages/utils/src` 复制工具函数到 [apps/hub/src/lib](file://c:\project\ifa\apps\hub\src\lib)
5. 更新导入路径，使用相对路径引用本地组件和工具函数
6. 运行 `pnpm install`
7. 运行 `pnpm build` 构建应用
8. 运行 `pnpm start` 启动应用

## 共享组件处理

### 使用 npm 包（推荐）

直接从 `@iflux-art/ui` 和 `@iflux-art/utils` 导入：

```typescript
import { Button } from '@iflux-art/ui';
import { cn } from '@iflux-art/utils';
```

### UI 组件

将需要的 UI 组件从 `packages/ui/src/components` 复制到 [apps/hub/src/components/ui](file://c:\project\ifa\apps\hub\src\components\ui)：

```
packages/ui/src/components/card.tsx → apps/hub/src/components/ui/card.tsx
packages/ui/src/components/button.tsx → apps/hub/src/components/ui/button.tsx
...
```

### 工具函数

将工具函数从 `packages/utils/src` 复制到 [apps/hub/src/lib](file://c:\project\ifa\apps\hub\src\lib)：

```
packages/utils/src/cn.ts → apps/hub/src/lib/utils.ts
...
```

## 导入路径更新

复制组件和工具函数后，需要更新导入路径：

```typescript
// 之前 (workspace 引用)
import { Button } from '@repo/ui/button'
import { cn } from '@repo/utils'

// 之后 (npm 包引用)
import { Button } from '@iflux-art/ui'
import { cn } from '@iflux-art/utils'

// 或者 (本地引用)
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## 自动化脚本

应用目录中包含一个自动化脚本 [setup-standalone.js](file://c:\project\ifa\apps\hub\setup-standalone.js)，可以自动执行大部分配置更改：

```bash
cd apps/hub
node setup-standalone.js
```

## 注意事项

1. 独立部署后，你将无法享受 monorepo 的自动链接和同步更新功能
2. 需要手动更新共享包的版本
3. 如果共享包有更新，需要重新部署应用
4. 独立部署版本的维护成本会增加，因为需要手动同步共享代码的更新
5. 确保 `@iflux-art/*` 包已发布到 npm