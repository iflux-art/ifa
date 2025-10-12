"use client";

/**
 * 客户端错误回退组件
 * 用于在服务端渲染时提供交互功能
 */
export function ErrorFallback({
  title = "页面加载失败",
  message = "请刷新页面重试",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 font-semibold text-xl">{title}</h1>
        <p className="mb-4 text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}

/**
 * 管理页面错误回退组件
 */
export function AdminErrorFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="mb-2 font-semibold text-destructive text-lg">管理页面加载失败</h2>
        <p className="mb-4 text-muted-foreground text-sm">请检查网络连接或刷新页面重试</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}
