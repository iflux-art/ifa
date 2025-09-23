import { Clock } from "lucide-react";

/**
 * 计算预计阅读时间
 * 基于中文阅读速度约 300-400 字/分钟，英文约 200-250 词/分钟
 * 这里采用保守估计 250 字/分钟
 */
function calculateReadingTime(wordCount: number): string {
  if (wordCount === 0) return "0 分钟";

  const wordsPerMinute = 250;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) return "1 分钟";
  if (minutes < 60) return `${minutes} 分钟`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours} 小时`;
  return `${hours} 小时 ${remainingMinutes} 分钟`;
}

interface ReadingTimeProps {
  wordCount: number;
}

/**
 * 预计阅读时间组件
 * 用于显示内容的预计阅读时间
 */
export const ReadingTime = ({ wordCount }: ReadingTimeProps) => {
  if (wordCount <= 0) return null;

  const readingTime = calculateReadingTime(wordCount);

  return (
    <div className="flex items-center">
      <Clock className="mr-1 h-4 w-4" />
      <span>预计阅读 {readingTime}</span>
    </div>
  );
};
