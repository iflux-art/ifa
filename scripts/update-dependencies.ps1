# 依赖更新脚本 (PowerShell)
# 运行此脚本以将所有依赖更新到最新版本

Write-Host "🔄 Updating dependencies across monorepo..." -ForegroundColor Cyan

# 更新根依赖
Write-Host "📦 Updating root package..." -ForegroundColor Yellow
pnpm update --latest

# 更新应用依赖
Get-ChildItem -Path "apps" -Directory | ForEach-Object {
    $appPath = $_.FullName
    $packageJsonPath = Join-Path $appPath "package.json"
    
    if (Test-Path $packageJsonPath) {
        Write-Host "📱 Updating $($_.Name)..." -ForegroundColor Yellow
        Push-Location $appPath
        pnpm update --latest
        Pop-Location
    }
}

# 更新包依赖
Get-ChildItem -Path "packages" -Directory | ForEach-Object {
    $pkgPath = $_.FullName
    $packageJsonPath = Join-Path $pkgPath "package.json"
    
    if (Test-Path $packageJsonPath) {
        Write-Host "📦 Updating $($_.Name)..." -ForegroundColor Yellow
        Push-Location $pkgPath
        pnpm update --latest
        Pop-Location
    }
}

Write-Host "✅ All dependencies updated!" -ForegroundColor Green
Write-Host "🧪 Running tests to ensure everything works..." -ForegroundColor Cyan
pnpm test

Write-Host "🎉 Update complete!" -ForegroundColor Green