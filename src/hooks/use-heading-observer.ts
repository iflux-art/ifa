"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 定义 Heading 类型以确保与 TocHeading 兼容
interface Heading {
	level: number;
	text: string;
	id: string;
}

export function useHeadingObserver(
	headings: Heading[],
	options = {
		rootMargin: "-80px 0px -70% 0px",
		threshold: 0,
	},
) {
	const [activeId, setActiveId] = useState<string>("");
	const clickedHeadingRef = useRef<string | null>(null);
	const timeoutRef = useRef<number | null>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);

	// 基于滚动位置更新活动标题
	const updateActiveHeading = useCallback(() => {
		if (clickedHeadingRef.current) return;
		if (headings.length === 0) return;

		// 获取所有标题元素
		const headingElements = headings
			.map((heading) => ({
				id: heading.id,
				element: document.getElementById(heading.id),
			}))
			.filter((item) => item.element !== null);

		if (headingElements.length === 0) return;

		// 找到当前视野中最上面的可见标题
		const viewportHeight = window.innerHeight;

		let currentActive = "";
		let minDistance = Infinity;

		headingElements.forEach(({ id, element }) => {
			if (!element) return;
			const rect = element.getBoundingClientRect();

			// 检查标题是否在视口内或附近
			if (rect.top <= viewportHeight * 0.8 && rect.bottom > 0) {
				const distance = Math.abs(rect.top - 100); // 100px from top
				if (distance < minDistance) {
					minDistance = distance;
					currentActive = id;
				}
			}
		});

		if (currentActive && currentActive !== activeId) {
			setActiveId(currentActive);
		}
	}, [headings, activeId]);

	// 监听URL哈希变化，以检测标题点击
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.slice(1);
			if (hash && headings.some((h) => h.id === hash)) {
				clickedHeadingRef.current = hash;
				setActiveId(hash);

				// 设置一个短暂的超时，在此期间保持点击的标题为活动状态
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = window.setTimeout(() => {
					clickedHeadingRef.current = null;
				}, 1000); // 1秒后恢复正常的观察行为
			}
		};

		window.addEventListener("hashchange", handleHashChange);

		// 初始化时检查哈希
		if (window.location.hash) {
			handleHashChange();
		}

		return () => {
			window.removeEventListener("hashchange", handleHashChange);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [headings]);

	// 使用 IntersectionObserver 观察标题
	useEffect(() => {
		if (headings.length === 0) return;

		// 如果之前有 observer，先断开
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		// 创建一个共享的 IntersectionObserver 实例
		const observer = new IntersectionObserver((entries) => {
			// 如果有明确点击的标题，优先使用它
			if (clickedHeadingRef.current) return;

			// 收集所有当前可见的标题
			const visibleHeadings = entries
				.filter((entry) => entry.isIntersecting)
				.map((entry) => ({
					id: entry.target.id,
					top: entry.boundingClientRect.top,
				}));

			if (visibleHeadings.length === 0) return;

			// 按照在页面中的位置排序（从上到下）
			visibleHeadings.sort((a, b) => a.top - b.top);

			// 选择最上方的可见标题作为活动标题
			const firstVisibleHeading = visibleHeadings[0];
			if (firstVisibleHeading) {
				setActiveId(firstVisibleHeading.id);
			}
		}, options);

		observerRef.current = observer;

		// 确保所有标题都有ID
		const ensureHeadingIds = () => {
			headings.forEach((heading) => {
				const element = document.getElementById(heading.id);
				if (!element) {
					// 查找匹配文本内容的标题元素
					const headingElements = document.querySelectorAll(
						"h1, h2, h3, h4, h5, h6",
					);
					headingElements.forEach((el) => {
						if (el.textContent?.trim() === heading.text) {
							if (!el.id) {
								el.id = heading.id;
							}
						}
					});
				}
			});
		};

		// 初始化和延迟检查
		ensureHeadingIds();
		const initTimeout = setTimeout(ensureHeadingIds, 500);

		// 观察所有标题
		const observeHeadings = () => {
			headings.forEach((heading) => {
				const element = document.getElementById(heading.id);
				if (element) {
					observer.observe(element);
				}
			});
		};

		const observeTimeout = setTimeout(observeHeadings, 100);

		// 添加滚动监听作为备选方案
		const scrollTimeout = setTimeout(() => {
			window.addEventListener("scroll", updateActiveHeading, { passive: true });
		}, 1000);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", updateActiveHeading);
			clearTimeout(initTimeout);
			clearTimeout(observeTimeout);
			clearTimeout(scrollTimeout);
		};
	}, [headings, options, updateActiveHeading]);

	return activeId;
}
