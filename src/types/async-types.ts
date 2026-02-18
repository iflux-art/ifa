/**
 * 异步操作相关类型定义
 */

export interface UseAsyncOptions<T> {
	/** 设置加载状态的函数 */
	setLoading?: (loading: boolean) => void;
	/** 设置错误信息的函数 */
	setError?: (error: string | null) => void;
	/** 操作成功时的回调函数 */
	onSuccess?: (data: T) => void;
	/** 操作失败时的回调函数 */
	onError?: (error: unknown) => void;
	/** 内容类型（用于错误处理） */
	contentType?: "blog" | "links";
	/** 内容ID（用于错误处理） */
	contentId?: string;
	/** 数据验证函数 */
	validator?: (data: T) => boolean;
}
