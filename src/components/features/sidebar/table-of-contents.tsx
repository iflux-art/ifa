"use client";

import { Text } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeadingObserver } from "@/hooks/use-heading-observer";
import { cn } from "@/lib/utils";

/**
 * 目录标题
 */
interface TocHeading {
	/** 标题ID */
	id: string;
	/** 标题文本 */
	text: string;
	/** 标题级别 */
	level: number;
}

/**
 * 目录卡片 Props
 */
export interface TableOfContentsProps {
	/** 标题列表 */
	headings: TocHeading[];
	/** 自定义类名 */
	className?: string;
	/** 卡片标题 */
	title?: string;
}

/**
 * 页面顶部固定导航栏的高度
 */
const NAVBAR_HEIGHT = 80;
/**
 * 滚动偏移量，用于锚点定位时避免被导航栏遮挡
 */
const SCROLL_OFFSET = NAVBAR_HEIGHT;

/**
 * 平滑滚动到指定元素
 * @param elementId 目标元素ID
 * @param offset 偏移量（默认为0）
 * @param updateHash 是否更新URL hash（默认为false）
 */
function scrollToElement(
	elementId: string,
	offset = 0,
	updateHash = false,
): void {
	const element = document.getElementById(elementId);
	if (!element) {
		return;
	}

	const elementPosition = element.getBoundingClientRect().top;
	const offsetPosition = elementPosition + window.scrollY - offset;

	// 使用浏览器原生平滑滚动
	window.scrollTo({
		top: offsetPosition,
		behavior: "smooth",
	});

	// 如果需要更新hash，在滚动完成后更新
	if (updateHash) {
		// 使用setTimeout确保在滚动完成后更新hash
		setTimeout(() => {
			history.replaceState(null, "", `#${elementId}`);
			// 触发hashchange事件，使useHeadingObserver能够正确更新active状态
			window.dispatchEvent(new HashChangeEvent("hashchange"));
		}, 100);
	}
}

// 标题项组件
interface HeadingItemProps {
	heading: TocHeading;
	isActive: boolean;
}

const HeadingItem = ({ heading, isActive }: HeadingItemProps) => {
	// 计算缩进，根据标题级别
	const indent = (heading.level - 2) * 0.75;

	// 添加状态跟踪hover
	const [isHovered, setIsHovered] = useState(false);

	// 根据标题级别设置不同的样式
	const headingSize =
		{
			2: "font-medium",
			3: "font-normal",
			4: "text-sm",
		}[heading.level] ?? "";

	return (
		<div className="relative">
			{/* 选中状态的粗线 */}
			<div
				className={`absolute top-1.5 bottom-1.5 left-2 w-0.5 rounded-full transition-all duration-300 ease-out ${
					isActive
						? "bg-primary opacity-100"
						: isHovered
							? "bg-primary/30 opacity-100"
							: "bg-transparent opacity-0"
				}`}
			/>

			<a
				href={`#${heading.id}`}
				className={cn(
					"group relative flex min-w-0 items-start py-1.5 text-sm transition-colors duration-200",
					headingSize,
					// 普通文本
					"text-muted-foreground",
					// hover 状态
					isHovered && "rounded-sm bg-primary/5 font-medium text-foreground",
					// active 状态
					isActive && "rounded-sm bg-primary/10 font-medium text-foreground",
					"w-full",
				)}
				style={{
					paddingLeft: heading.level > 2 ? `calc(${indent}rem + 1rem)` : "1rem",
				}}
				onClick={(e) => {
					e.preventDefault();
					// 直接滚动到元素，不更新hash
					scrollToElement(heading.id, SCROLL_OFFSET, true);
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<span className="overflow-wrap-anywhere block w-full hyphens-auto whitespace-normal break-words text-left leading-relaxed">
					{heading.text}
				</span>
			</a>
		</div>
	);
};

// 目录容器组件
interface TocContainerProps {
	headings: TocHeading[];
	activeId: string | null;
	tocRef: React.RefObject<HTMLDivElement | null>;
}

const TocContainer = ({ headings, activeId, tocRef }: TocContainerProps) => (
	<div
		ref={tocRef}
		className="hide-scrollbar max-h-64 overflow-y-auto scroll-smooth"
	>
		<div className="relative">
			{/* 左侧细线 */}
			<div className="absolute top-0 bottom-0 left-2 w-px bg-border" />

			<div className="space-y-1">
				{headings.map((heading, _index) => (
					<HeadingItem
						key={heading.id}
						heading={heading}
						isActive={activeId === heading.id}
					/>
				))}
			</div>
		</div>
	</div>
);

/**
 * 目录卡片组件
 *
 * 以卡片形式显示文档的目录结构，支持点击导航和滚动高亮
 * 样式与其他侧边栏卡片保持一致
 */
export const TableOfContents = ({
	headings,
	className,
	title = "目录",
}: TableOfContentsProps) => {
	const tocRef = useRef<HTMLDivElement>(null);

	// 使用自定义 hook 处理标题观察
	const activeId = useHeadingObserver(headings);

	// 自动滚动目录到当前活动标题
	useEffect(() => {
		// 如果没有标题，不执行任何操作
		if (headings.length === 0 || !activeId || !tocRef.current) {
			return;
		}

		// 防抖逻辑
		const timeoutId = setTimeout(() => {
			const activeElement = tocRef.current?.querySelector(
				`a[href="#${activeId}"]`,
			);

			if (activeElement && tocRef.current) {
				const containerRect = tocRef.current.getBoundingClientRect();
				const activeRect = activeElement.getBoundingClientRect();

				const isInView =
					activeRect.top >= containerRect.top &&
					activeRect.bottom <= containerRect.bottom;

				if (!isInView) {
					const scrollTop =
						activeRect.top -
						containerRect.top -
						containerRect.height / 2 +
						activeRect.height / 2;

					// 使用更平滑的滚动
					tocRef.current.scrollTo({
						top: tocRef.current.scrollTop + scrollTop,
						behavior: "smooth",
					});
				}
			}
		}, 100); // 减少延迟以提高响应性

		return () => {
			clearTimeout(timeoutId);
		};
	}, [activeId, headings.length]);

	// 过滤掉h1标题，只显示h2-h4
	const filteredHeadings = headings.filter(
		(heading: TocHeading) => heading.level >= 2 && heading.level <= 4,
	);

	// 根据标题级别对目录进行分组和嵌套
	const organizeHeadings = (headings: TocHeading[]) =>
		// 确保标题ID唯一性
		headings.map((heading, index) => {
			// 如果ID为空或者不存在，生成一个基于文本的ID
			if (!heading.id) {
				heading.id = `heading-${heading.text
					.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[^\w-]/g, "")}-${index}`;
			}
			return heading;
		});
	// 如果过滤后没有标题，返回null，不显示任何内容
	if (filteredHeadings.length === 0) {
		return null;
	}

	const organizedHeadings = organizeHeadings(filteredHeadings);

	return (
		<Card
			className={cn(
				"w-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
				className,
			)}
		>
			<CardHeader className="pt-4 pb-2">
				<CardTitle className="flex items-center gap-2 font-medium text-foreground text-sm">
					<Text className="h-3.5 w-3.5 text-primary" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0 pb-4">
				<TocContainer
					headings={organizedHeadings}
					activeId={activeId}
					tocRef={tocRef}
				/>
			</CardContent>
		</Card>
	);
};
