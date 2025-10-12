#!/bin/bash

# 依赖更新脚本
# 运行此脚本以将所有依赖更新到最新版本

echo "🔄 Updating dependencies across monorepo..."

# 更新根依赖
echo "📦 Updating root package..."
pnpm update --latest

# 更新应用依赖
for app in apps/*/; do
  if [ -f "$app/package.json" ]; then
    echo "📱 Updating $app..."
    cd "$app"
    pnpm update --latest
    cd ../..
  fi
done

# 更新包依赖
for pkg in packages/*/; do
  if [ -f "$pkg/package.json" ]; then
    echo "📦 Updating $pkg..."
    cd "$pkg"
    pnpm update --latest
    cd ../..
  fi
done

echo "✅ All dependencies updated!"
echo "🧪 Running tests to ensure everything works..."
pnpm test

echo "🎉 Update complete!"
