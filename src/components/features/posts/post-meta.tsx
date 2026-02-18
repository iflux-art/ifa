import { Calculator, Calendar, Clock } from "lucide-react";
import { formatReadingTime } from "@/components/features/posts/client-utils";

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
		<div className="flex flex-wrap items-center gap-y-2 font-medium text-muted-foreground text-sm">
			{/* 发布日期 */}
			{date && (
				<div className="flex items-center">
					<Calendar className="mr-1 h-4 w-4" />
					<time>{date}</time>
				</div>
			)}

			{/* 字数统计 */}
			{wordCount > 0 && (
				<>
					<div className="mx-2 text-muted-foreground/50">|</div>
					<div className="flex items-center">
						<Calculator className="mr-1 h-4 w-4" />
						<span>{wordCount} 字</span>
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
