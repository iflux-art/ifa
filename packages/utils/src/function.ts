/**
 * 创建一个防抖函数，在等待毫秒数后延迟调用func
 * @param func - 要防抖的函数
 * @param wait - 延迟的毫秒数
 * @returns 防抖函数
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型函数类型需要any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  // biome-ignore lint/suspicious/noExplicitAny: 函数上下文需要any类型
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 创建一个节流函数，每等待毫秒数最多调用一次func
 * @param func - 要节流的函数
 * @param wait - 节流调用的毫秒数
 * @returns 节流函数
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型函数类型需要any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  // biome-ignore lint/suspicious/noExplicitAny: 函数上下文需要any类型
  return function (this: any, ...args: Parameters<T>) {
    if (inThrottle) {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= wait) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastRan), 0)
      );
    } else {
      func.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
    }
  };
}

/**
 * 创建函数的记忆化版本
 * @param func - 要记忆化的函数
 * @param keyFn - 可选的生成缓存键的函数
 * @returns 记忆化函数
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic function type requires any
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      const cachedResult = cache.get(key);
      if (cachedResult !== undefined) {
        return cachedResult;
      }
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 从右到左组合函数
 * @param fns - 要组合的函数
 * @returns 组合函数
 */
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

/**
 * 从左到右管道函数
 * @param fns - 要管道的函数
 * @returns 管道函数
 */
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}
