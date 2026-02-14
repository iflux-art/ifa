# Implementation Plan

- [x] 1. 更新根 package.json 配置




  - 从 scripts 部分移除所有 web 应用相关的命令
  - 移除的脚本包括：dev:web, build:web, start:web, test:e2e:web
  - 保留通用脚本和其他应用的脚本
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. 删除 web 应用目录




  - 删除整个 apps/web 目录及其所有内容
  - 验证 apps/blog 和 apps/hub 目录完整无损
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. 清理构建缓存





  - 删除 .turbo 目录以清除所有构建缓存
  - 确保不存在 web 应用的缓存残留
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. 验证项目完整性




  - 执行 pnpm install 重新安装依赖
  - 验证 blog 和 hub 应用可以正常启动
  - 确认没有与缺失 web 应用相关的错误
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
