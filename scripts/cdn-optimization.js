#!/usr/bin/env node

/**
 * CDN 优化配置脚本
 * 生成和配置 CDN 缓存策略
 */

const fs = require('fs');
const path = require('path');

/**
 * CDN 缓存配置
 */
const CDN_CONFIG = {
  // 静态资源配置
  staticAssets: {
    patterns: ['*.js', '*.css', '*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.ico', '*.woff', '*.woff2'],
    cacheControl: 'public, max-age=31536000, immutable', // 1年
    compress: true,
    brotli: true,
  },
  
  // HTML 页面配置
  htmlPages: {
    patterns: ['*.html', '/'],
    cacheControl: 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400', // 1小时
    compress: true,
    brotli: true,
  },
  
  // API 响应配置
  apiResponses: {
    patterns: ['/api/*'],
    cacheControl: 'public, max-age=300, s-maxage=600, stale-while-revalidate=1800', // 5分钟
    compress: true,
    cors: true,
  },
  
  // 图片优化配置
  images: {
    patterns: ['*.png', '*.jpg', '*.jpeg', '*.webp', '*.avif'],
    cacheControl: 'public, max-age=2592000, immutable', // 30天
    compress: true,
    webp: true,
    avif: true,
    quality: 85,
  },
};

/**
 * 生成 Vercel 配置
 */
function generateVercelConfig() {
  const config = {
    version: 2,
    builds: [
      {
        src: 'package.json',
        use: '@vercel/next',
      },
    ],
    headers: [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: CDN_CONFIG.staticAssets.cacheControl,
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: CDN_CONFIG.staticAssets.cacheControl,
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: CDN_CONFIG.images.cacheControl,
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: CDN_CONFIG.apiResponses.cacheControl,
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ],
    rewrites: [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ],
  };
  
  return config;
}

/**
 * 生成 Netlify 配置
 */
function generateNetlifyConfig() {
  const config = {
    build: {
      command: 'pnpm build',
      publish: '.next',
    },
    headers: [
      {
        for: '/*',
        values: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'origin-when-cross-origin',
        },
      },
      {
        for: '/static/*',
        values: {
          'Cache-Control': CDN_CONFIG.staticAssets.cacheControl,
        },
      },
      {
        for: '/_next/static/*',
        values: {
          'Cache-Control': CDN_CONFIG.staticAssets.cacheControl,
        },
      },
      {
        for: '/images/*',
        values: {
          'Cache-Control': CDN_CONFIG.images.cacheControl,
        },
      },
      {
        for: '/api/*',
        values: {
          'Cache-Control': CDN_CONFIG.apiResponses.cacheControl,
          'Access-Control-Allow-Origin': '*',
        },
      },
    ],
    redirects: [
      {
        from: '/sitemap.xml',
        to: '/api/sitemap',
        status: 200,
      },
      {
        from: '/robots.txt',
        to: '/api/robots',
        status: 200,
      },
    ],
  };
  
  return config;
}

/**
 * 生成 Cloudflare Workers 配置
 */
function generateCloudflareConfig() {
  const config = `
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // 获取原始响应
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  
  // 设置缓存头
  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/')) {
    newResponse.headers.set('Cache-Control', '${CDN_CONFIG.staticAssets.cacheControl}')
  } else if (pathname.startsWith('/images/')) {
    newResponse.headers.set('Cache-Control', '${CDN_CONFIG.images.cacheControl}')
  } else if (pathname.startsWith('/api/')) {
    newResponse.headers.set('Cache-Control', '${CDN_CONFIG.apiResponses.cacheControl}')
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
  } else {
    newResponse.headers.set('Cache-Control', '${CDN_CONFIG.htmlPages.cacheControl}')
  }
  
  // 设置安全头
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  newResponse.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  return newResponse
}
`;
  
  return config;
}

/**
 * 生成 Apache .htaccess 配置
 */
function generateApacheConfig() {
  const config = `
# 启用压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# 缓存控制
<IfModule mod_expires.c>
    ExpiresActive On
    
    # 静态资源
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    
    # HTML 页面
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# 安全头
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "origin-when-cross-origin"
</IfModule>
`;
  
  return config;
}

/**
 * 生成 Nginx 配置
 */
function generateNginxConfig() {
  const config = `
# 压缩配置
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;

# 缓存配置
location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-Content-Type-Options nosniff;
}

location ~* \\.(html)$ {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "origin-when-cross-origin";
}

location /api/ {
    expires 5m;
    add_header Cache-Control "public, max-age=300";
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
}
`;
  
  return config;
}

/**
 * 为每个应用生成配置文件
 */
function generateConfigsForApps() {
  const apps = ['web', 'blog', 'hub'];
  
  apps.forEach(appName => {
    const appPath = path.join(process.cwd(), 'apps', appName);
    
    if (!fs.existsSync(appPath)) {
      console.log(`❌ 应用 ${appName} 不存在`);
      return;
    }
    
    console.log(`📝 为 ${appName} 生成 CDN 配置...`);
    
    // 生成 Vercel 配置
    const vercelConfig = generateVercelConfig();
    fs.writeFileSync(
      path.join(appPath, 'vercel.json'),
      JSON.stringify(vercelConfig, null, 2)
    );
    
    // 生成 Netlify 配置
    const netlifyConfig = generateNetlifyConfig();
    fs.writeFileSync(
      path.join(appPath, 'netlify.toml'),
      Object.entries(netlifyConfig)
        .map(([key, value]) => `[${key}]\\n${JSON.stringify(value, null, 2)}`)
        .join('\\n\\n')
    );
    
    // 生成 Cloudflare Workers 配置
    const cloudflareConfig = generateCloudflareConfig();
    fs.writeFileSync(
      path.join(appPath, 'worker.js'),
      cloudflareConfig
    );
    
    // 生成 Apache 配置
    const apacheConfig = generateApacheConfig();
    fs.writeFileSync(
      path.join(appPath, '.htaccess'),
      apacheConfig
    );
    
    console.log(`✅ ${appName} CDN 配置生成完成`);
  });
}

/**
 * 生成性能优化报告
 */
function generateOptimizationReport() {
  const reportPath = path.join(process.cwd(), 'cdn-optimization-report.md');
  const timestamp = new Date().toISOString();
  
  const report = `# CDN 优化配置报告

生成时间: ${timestamp}

## 配置概览

### 静态资源缓存策略
- **缓存时间**: 1年 (31536000秒)
- **策略**: public, immutable
- **压缩**: 启用 Gzip 和 Brotli
- **文件类型**: JS, CSS, 图片, 字体等

### HTML 页面缓存策略
- **缓存时间**: 1小时 (3600秒)
- **CDN 缓存**: 2小时 (7200秒)
- **Stale-while-revalidate**: 24小时
- **压缩**: 启用

### API 响应缓存策略
- **缓存时间**: 5分钟 (300秒)
- **CDN 缓存**: 10分钟 (600秒)
- **Stale-while-revalidate**: 30分钟
- **CORS**: 启用

### 图片优化策略
- **缓存时间**: 30天 (2592000秒)
- **格式**: WebP, AVIF 支持
- **质量**: 85%
- **压缩**: 启用

## 支持的 CDN 平台

- ✅ Vercel
- ✅ Netlify  
- ✅ Cloudflare Workers
- ✅ Apache (.htaccess)
- ✅ Nginx

## 性能优化建议

1. **启用 HTTP/2**: 提升多路复用性能
2. **使用 Brotli 压缩**: 比 Gzip 更高的压缩率
3. **实施 Service Worker**: 离线缓存和后台同步
4. **优化图片格式**: 使用 WebP/AVIF 格式
5. **启用 CDN**: 全球内容分发网络
6. **监控缓存命中率**: 定期检查缓存效果

## 安全配置

- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: origin-when-cross-origin
- ✅ CORS 配置

## 下一步行动

1. 根据实际需求调整缓存时间
2. 监控 CDN 性能指标
3. 定期更新安全头配置
4. 实施 A/B 测试验证效果
`;
  
  fs.writeFileSync(reportPath, report);
  console.log(`📋 CDN 优化报告已生成: ${reportPath}`);
}

// 主函数
function main() {
  console.log('🚀 开始生成 CDN 优化配置...\n');
  
  generateConfigsForApps();
  generateOptimizationReport();
  
  console.log('\n✅ CDN 优化配置生成完成！');
  console.log('\n📌 下一步:');
  console.log('1. 根据部署平台选择相应的配置文件');
  console.log('2. 测试缓存策略是否生效');
  console.log('3. 监控性能指标和缓存命中率');
}

if (require.main === module) {
  main();
}

module.exports = {
  generateVercelConfig,
  generateNetlifyConfig,
  generateCloudflareConfig,
  generateApacheConfig,
  generateNginxConfig,
  CDN_CONFIG,
};