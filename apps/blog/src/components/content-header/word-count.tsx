import { Calculator } from "lucide-react";

interface WordCountProps {
  wordCount: number;
}

/**
 * 字数统计组件
 * 用于显示内容的字数统计
 */
export const WordCount = ({ wordCount }: WordCountProps) => {
  if (wordCount <= 0) return null;

  return (
    <div className="flex items-center">
      <Calculator className="mr-1 h-4 w-4" />
      <span>全文共计 {wordCount} 字</span>
    </div>
  );
};
