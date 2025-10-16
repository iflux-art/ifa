import { Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 最新文章类型定义
export interface LatestPost {
  title: string;
  href: string;
  date?: string;
  category?: string;
}

export interface LatestPostsCardProps {
  posts?: LatestPost[];
  currentSlug: string[];
}

/**
 * 最新发布文章卡片组件
 */
export const LatestPostsCard = ({ posts = [], currentSlug }: LatestPostsCardProps) => {
  const validPosts = posts || [];

  // 即使没有最新文章也渲染组件
  const currentPath = `/posts/${currentSlug.join("/")}`;

  return (
    <Card className="w-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 font-medium text-foreground text-sm">
          <Clock className="h-3.5 w-3.5 text-primary" />
          最新发布
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {validPosts.length > 0 ? (
          validPosts.slice(0, 5).map((post) => {
            const isActive = currentPath === post.href;
            return (
              <Link
                key={post.href}
                href={post.href}
                className={cn(
                  "group flex items-start gap-2 rounded-md p-2 text-xs transition-all duration-200 hover:bg-muted/60 active:scale-[0.98]",
                  isActive && "bg-muted font-medium text-primary"
                )}
              >
                <FileText className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/70 group-hover:text-foreground/80" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-muted-foreground leading-relaxed group-hover:text-foreground">
                    {post.title}
                  </p>
                  {post.date && (
                    <p className="mt-1 text-muted-foreground/60 text-xs">
                      {new Date(post.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm">暂无最新文章</p>
        )}
      </CardContent>
    </Card>
  );
};
