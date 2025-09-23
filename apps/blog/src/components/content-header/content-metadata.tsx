import { ContentDates } from "./content-dates";
import { ReadingTime } from "./reading-time";
import { WordCount } from "./word-count";

interface ContentMetadataProps {
  date?: string | null;
  updatedAt?: string | null;
  wordCount?: number;
}

/**
 * 内容元数据组件
 * 用于显示内容的元数据信息，包括发布日期、更新日期、字数统计和预计阅读时间
 */
export const ContentMetadata = ({
  date,
  updatedAt,
  wordCount = 0,
}: ContentMetadataProps) => {
  const showDates = date || updatedAt;
  const showWordCount = wordCount > 0;
  const showReadingTime = wordCount > 0;

  // 如果没有任何元数据要显示，则返回 null
  if (!showDates && !showWordCount && !showReadingTime) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-y-2 text-sm font-medium text-muted-foreground">
      {/* 发布日期和更新日期 */}
      {showDates && <ContentDates date={date} updatedAt={updatedAt} />}

      {/* 字数统计 */}
      {showWordCount && (
        <>
          <div className="mx-2 text-muted-foreground/50">|</div>
          <WordCount wordCount={wordCount} />
        </>
      )}

      {/* 预计阅读时间 */}
      {showReadingTime && (
        <>
          <div className="mx-2 text-muted-foreground/50">|</div>
          <ReadingTime wordCount={wordCount} />
        </>
      )}
    </div>
  );
};
