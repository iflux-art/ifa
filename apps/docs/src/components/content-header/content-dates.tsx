import { Calendar } from "lucide-react";

interface ContentDatesProps {
  date?: string | null;
  updatedAt?: string | null;
}

/**
 * 内容日期组件
 * 用于显示内容的发布日期和更新日期
 */
export const ContentDates = ({ date, updatedAt }: ContentDatesProps) => {
  if (!date && !updatedAt) return null;

  return (
    <div className="flex items-center">
      <Calendar className="mr-1 h-4 w-4" />
      <time>
        {date && `发布于 ${date}`}
        {date && updatedAt && " · "}
        {updatedAt && `更新于 ${updatedAt}`}
      </time>
    </div>
  );
};
