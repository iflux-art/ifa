import { Calculator, Calendar, Clock } from "lucide-react";

export interface PostMetaProps {
  date?: string | null;
  updatedAt?: string | null;
  wordCount?: number;
}

/**
 * 计算预计阅读时间
 * 基于中文阅读速度约 300-400 字/分钟，英文约 200-250 词/分钟
 * 这里采用保守估计 250 字/分钟
 */
function calculateReadingTime(wordCount: number): string {
  if (wordCount === 0) {
    return "0 分钟";
  }

  const wordsPerMinute = 250;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) {
    return "1 分钟";
  }

  if (minutes < 60) {
    return `${minutes} 分钟`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} 小时`;
  }

  return `${hours} 小时 ${remainingMinutes} 分钟`;
}

/**
 * 文章元数据组件
 *
 * 显示文章的发布日期、更新日期、字数统计和预计阅读时间
 */
export const PostMeta = ({ date, updatedAt, wordCount = 0 }: PostMetaProps) => {
  const readingTime = calculateReadingTime(wordCount);

  return (
    <div className="flex flex-wrap items-center gap-y-2 font-medium text-muted-foreground text-sm">
      {/* 发布日期和更新日期 */}
      {(date || updatedAt) && (
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          <time>
            {date && `发布于 ${date}`}
            {date && updatedAt && " · "}
            {updatedAt && `更新于 ${updatedAt}`}
          </time>
        </div>
      )}

      {/* 字数统计 */}
      {wordCount > 0 && (
        <>
          <div className="mx-2 text-muted-foreground/50">|</div>
          <div className="flex items-center">
            <Calculator className="mr-1 h-4 w-4" />
            <span>全文共计 {wordCount} 字</span>
          </div>
        </>
      )}

      {/* 预计阅读时间 */}
      {wordCount > 0 && (
        <>
          <div className="mx-2 text-muted-foreground/50">|</div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>预计阅读 {readingTime}</span>
          </div>
        </>
      )}
    </div>
  );
};
