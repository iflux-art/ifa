/**
 * Throttle function options
 */
export interface ThrottleOptions {
  /** Execute on the leading edge of the timeout */
  leading?: boolean
  /** Execute on the trailing edge of the timeout */
  trailing?: boolean
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Options object
 * @returns The throttled function
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled')
 * }, 100)
 *
 * window.addEventListener('scroll', throttledScroll)
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  const { leading = true, trailing = true } = options

  let timeoutId: NodeJS.Timeout | undefined
  let lastArgs: Parameters<T> | undefined
  let lastThis: ThisParameterType<T> | undefined
  let result: ReturnType<T> | undefined
  let lastCallTime: number | undefined
  let lastInvokeTime = 0

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs as Parameters<T>
    const thisArg = lastThis as ThisParameterType<T>

    lastArgs = undefined
    lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args) as ReturnType<T> | undefined
    return result
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time
    timeoutId = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : getResult()
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0)
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return Math.min(timeWaiting, wait - timeSinceLastInvoke)
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0)
    // const _timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0
    )
  }

  function timerExpired(): ReturnType<T> | undefined {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time))
    return getResult()
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timeoutId = undefined

    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = undefined
    lastThis = undefined
    return getResult()
  }

  function cancel(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    lastInvokeTime = 0
    lastArgs = undefined
    lastCallTime = undefined
    lastThis = undefined
    timeoutId = undefined
  }

  function flush(): ReturnType<T> | undefined {
    return timeoutId === undefined ? result : trailingEdge(Date.now())
  }

  function getResult(): ReturnType<T> | undefined {
    return result
  }

  function throttled(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (leading) {
        timeoutId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait)
    }
    return getResult()
  }

  throttled.cancel = cancel
  throttled.flush = flush

  return throttled as T & {
    cancel: () => void
    flush: () => ReturnType<T> | undefined
  }
}