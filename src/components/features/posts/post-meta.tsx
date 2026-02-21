import { Calculator, Calendar, Clock } from "lucide-react";
import { formatReadingTime } from "@/components/features/posts/client-utils";
import { cn } from "@/lib/utils";

export interface PostMetaProps {
	date?: string | null;
	wordCount?: number;
}

/**
 * 文章元数据组件
 *
 * 显示文章的发布日期、字数统计和预计阅读时间
 */
export const PostMeta = ({ date, wordCount = 0 }: PostMetaProps) => {
	const readingTime = formatReadingTime(wordCount);

	return (
		<div className="flex flex-wrap items-center gap-y-2 text-sm">
			{/* 发布日期 */}
			{date && (
				<div className="flex items-center gap-1.5">
					<Calendar className="h-4 w-4 text-primary" />
					<time className="text-muted-foreground">{date}</time>
				</div>
			)}

			{/* 分隔符 */}
			{date && wordCount > 0 && (
				<div className="mx-1 h-4 w-px bg-muted-foreground/20" />
			)}

			{/* 字数统计 */}
			{wordCount > 0 && (
				<div className="flex items-center gap-1.5">
					<Calculator className="h-4 w-4 text-primary" />
					<span className="text-muted-foreground">{wordCount} 字</span>
				</div>
			)}

			{/* 分隔符 */}
			{wordCount > 0 && (
				<div className="mx-1 h-4 w-px bg-muted-foreground/20" />
			)}

			{/* 预计阅读时间 */}
			{wordCount > 0 && (
				<div className="flex items-center gap-1.5">
					<Clock className="h-4 w-4 text-primary" />
					<span className="text-muted-foreground">预计阅读 {readingTime}</span>
				</div>
			)}
		</div>
	);
};
