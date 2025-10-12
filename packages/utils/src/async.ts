/**
 * 创建一个在指定延迟后解析的Promise
 * @param ms - 延迟毫秒数
 * @returns 在延迟后解析的Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 创建一个在超时后拒绝的Promise
 * @param promise - 要添加超时的Promise
 * @param timeoutMs - 超时毫秒数
 * @param timeoutMessage - 自定义超时消息
 * @returns 如果达到超时则拒绝的Promise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = "Operation timed out"
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * 以指定的并发限制批量执行Promise
 * @param items - 要处理的项数组
 * @param asyncFn - 应用于每个项的异步函数
 * @param concurrency - 最大并发操作数
 * @returns 解析所有结果的Promise
 */
export async function batchAsync<T, R>(
  items: T[],
  asyncFn: (item: T, index: number) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchPromises = batch.map((item, batchIndex) => asyncFn(item, i + batchIndex));

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

/**
 * 使用指数退避重试逻辑执行异步函数
 * @param fn - 要执行的异步函数
 * @param maxRetries - 最大重试次数
 * @param baseDelay - 基础延迟毫秒数
 * @param maxDelay - 最大延迟毫秒数
 * @returns 带重试逻辑的Promise
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);
      await sleep(delay);
    }
  }

  throw lastError || new Error("Retry failed with unknown error");
}

/**
 * 创建一个顺序处理项的队列
 * @param processor - 处理每个项的函数
 * @returns 带添加方法的队列对象
 */
export function createQueue<T, R>(
  processor: (item: T) => Promise<R>
): {
  add: (item: T) => Promise<R>;
  size: () => number;
  clear: () => void;
} {
  const queue: Array<{
    item: T;
    resolve: (value: R) => void;
    reject: (error: Error) => void;
  }> = [];

  let processing = false;

  const processQueue = async () => {
    if (processing || queue.length === 0) {
      return;
    }

    processing = true;

    while (queue.length > 0) {
      const queueItem = queue.shift();
      if (!queueItem) {
        break;
      }
      const { item, resolve, reject } = queueItem;

      try {
        const result = await processor(item);
        resolve(result);
      } catch (error) {
        reject(error as Error);
      }
    }

    processing = false;
  };

  return {
    add: (item: T): Promise<R> => {
      return new Promise<R>((resolve, reject) => {
        queue.push({ item, resolve, reject });
        processQueue();
      });
    },
    size: () => queue.length,
    clear: () => {
      queue.length = 0;
    },
  };
}

/**
 * 轮询条件函数直到返回true或达到超时
 * @param conditionFn - 条件满足时返回true的函数
 * @param options - 轮询选项
 * @returns 条件满足时解析的Promise
 */
export async function poll(
  conditionFn: () => boolean | Promise<boolean>,
  options: {
    interval?: number;
    timeout?: number;
    timeoutMessage?: string;
  } = {}
): Promise<void> {
  const { interval = 1000, timeout = 30000, timeoutMessage = "Polling timed out" } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await conditionFn();
    if (result) {
      return;
    }

    await sleep(interval);
  }

  throw new Error(timeoutMessage);
}
