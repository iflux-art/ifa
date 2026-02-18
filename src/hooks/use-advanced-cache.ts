/**
 * 数据缓存 Hook
 * 使用 Next.js 最佳实践，简化客户端缓存
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

interface UseCacheOptions<T> {
	/** 缓存过期时间（毫秒） */
	expiry?: number;
	/** 数据验证函数 */
	validator?: (data: T) => boolean;
	/** 是否启用缓存 */
	enabled?: boolean;
}

// 简单的内存缓存
const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * 简化的数据缓存 Hook
 * 遵循 Next.js 最佳实践，服务端优先，客户端仅做轻量缓存
 */
export function useCache<T>(
	key: string,
	fetchFn: () => Promise<T>,
	options: UseCacheOptions<T> = {},
) {
	const {
		expiry = 5 * 60 * 1000, // 默认5分钟
		validator = () => true,
		enabled = true,
	} = options;

	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const initialLoadDone = useRef(false);

	// 从缓存获取数据
	const getFromCache = useCallback((): T | null => {
		if (!enabled) return null;

		const cached = memoryCache.get(key) as CacheEntry<T> | null;
		if (
			cached &&
			Date.now() - cached.timestamp < expiry &&
			validator(cached.data)
		) {
			return cached.data;
		}
		return null;
	}, [key, expiry, enabled, validator]);

	// 保存数据到缓存
	const saveToCache = useCallback(
		(dataToCache: T) => {
			if (!enabled) return;
			memoryCache.set(key, {
				data: dataToCache,
				timestamp: Date.now(),
			});
		},
		[key, enabled],
	);

	// 获取数据
	const fetchData = useCallback(async (): Promise<T | null> => {
		// 先检查缓存
		const cachedData = getFromCache();
		if (cachedData) {
			setData(cachedData);
			return cachedData;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await fetchFn();
			if (validator(result)) {
				saveToCache(result);
				setData(result);
				return result;
			}
			throw new Error("数据验证失败");
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			setError(error);
			return null;
		} finally {
			setLoading(false);
		}
	}, [fetchFn, getFromCache, saveToCache, validator]);

	// 刷新数据
	const refetch = useCallback(async () => {
		memoryCache.delete(key);
		return fetchData();
	}, [key, fetchData]);

	// 清除缓存
	const clearCache = useCallback(() => {
		memoryCache.delete(key);
		setData(null);
	}, [key]);

	// 初始化加载
	useEffect(() => {
		if (initialLoadDone.current || !enabled) return;
		initialLoadDone.current = true;
		fetchData().catch((err) => {
			console.warn("获取数据时出错:", err);
		});
	}, [fetchData, enabled]);

	return {
		data,
		loading,
		error,
		refetch,
		clearCache,
	};
}

// 向后兼容
export const useAdvancedCache = useCache;
