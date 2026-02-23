"use client";

import { Text } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMobileMenu } from "@/components/layout/navbar/mobile-menu-context";
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

	window.scrollTo({
		top: offsetPosition,
		behavior: "smooth",
	});

	if (updateHash) {
		setTimeout(() => {
			history.replaceState(null, "", `#${elementId}`);
			window.dispatchEvent(new HashChangeEvent("hashchange"));
		}, 100);
	}
}

// 标题项组件
interface HeadingItemProps {
	heading: TocHeading;
	isActive: boolean;
	onClick?: () => void;
}

function HeadingItem({ heading, isActive, onClick }: HeadingItemProps) {
	const indent = (heading.level - 2) * 0.75;

	const headingSize =
		{
			2: "font-medium",
			3: "font-normal",
			4: "font-normal",
		}[heading.level] ?? "";

	return (
		<div className="relative">
			<div
				className={`absolute top-1.5 bottom-1.5 left-2 w-0.5 rounded-full transition-all duration-300 ease-out ${
					isActive
						? "bg-primary opacity-100"
						: "bg-transparent opacity-0 group-hover:bg-primary/30 group-hover:opacity-100"
				}`}
			/>

			<a
				href={`#${heading.id}`}
				className={cn(
					"group relative flex min-w-0 items-start py-1.5 text-xs transition-colors duration-200",
					headingSize,
					"text-muted-foreground",
					"hover:rounded-sm hover:bg-primary/5 hover:font-medium hover:text-foreground",
					isActive && "rounded-sm bg-primary/10 font-medium text-foreground",
					"w-full",
				)}
				style={{
					paddingLeft: heading.level > 2 ? `calc(${indent}rem + 1rem)` : "1rem",
				}}
				onClick={(e) => {
					e.preventDefault();
					scrollToElement(heading.id, SCROLL_OFFSET, true);
					onClick?.();
				}}
			>
				<span className="overflow-wrap-anywhere block w-full hyphens-auto whitespace-normal break-words text-left leading-relaxed">
					{heading.text}
				</span>
			</a>
		</div>
	);
}

// 目录容器组件
interface TocContainerProps {
	headings: TocHeading[];
	activeId: string | null;
	tocRef: React.RefObject<HTMLDivElement | null>;
	onItemClick?: () => void;
}

function TocContainer({
	headings,
	activeId,
	tocRef,
	onItemClick,
}: TocContainerProps) {
	return (
		<div
			ref={tocRef}
			className="hide-scrollbar max-h-64 overflow-y-auto scroll-smooth"
		>
			<div className="relative">
				<div className="absolute top-0 bottom-0 left-2 w-px bg-border" />

				<div className="space-y-1">
					{headings.map((heading, _index) => (
						<HeadingItem
							key={heading.id}
							heading={heading}
							isActive={activeId === heading.id}
							onClick={onItemClick}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * 目录卡片组件
 */
export function TableOfContents({
	headings,
	className,
	title = "目录",
}: TableOfContentsProps) {
	const tocRef = useRef<HTMLDivElement>(null);
	const { closeMenu } = useMobileMenu();

	const activeId = useHeadingObserver(headings);

	useEffect(() => {
		if (headings.length === 0 || !activeId || !tocRef.current) {
			return;
		}

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

					tocRef.current.scrollTo({
						top: tocRef.current.scrollTop + scrollTop,
						behavior: "smooth",
					});
				}
			}
		}, 100);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [activeId, headings.length]);

	const filteredHeadings = headings.filter(
		(heading: TocHeading) => heading.level >= 2 && heading.level <= 4,
	);

	const organizeHeadings = (headings: TocHeading[]) =>
		headings.map((heading, index) => {
			if (!heading.id) {
				heading.id = `heading-${heading.text
					.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[^\w-]/g, "")}-${index}`;
			}
			return heading;
		});

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
					onItemClick={closeMenu}
				/>
			</CardContent>
		</Card>
	);
}
