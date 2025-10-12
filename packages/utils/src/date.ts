/**
 * 将日期格式化为可读字符串
 * @param date - 要格式化的日期
 * @param options - Intl.DateTimeFormat选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error("提供了无效的日期");
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
}

/**
 * 获取相对时间字符串（例如，"2小时前"，"3天后"）
 * @param date - 要比较的日期
 * @param baseDate - 要比较的基础日期（默认为现在）
 * @returns 相对时间字符串
 */
export function getRelativeTime(date: Date | string | number, baseDate: Date = new Date()): string {
  const dateObj = new Date(date);
  const baseDateObj = new Date(baseDate);

  if (Number.isNaN(dateObj.getTime()) || Number.isNaN(baseDateObj.getTime())) {
    throw new Error("提供了无效的日期");
  }

  const diffInSeconds = Math.floor((baseDateObj.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals = [
    { unit: "year" as const, seconds: 31536000 },
    { unit: "month" as const, seconds: 2592000 },
    { unit: "day" as const, seconds: 86400 },
    { unit: "hour" as const, seconds: 3600 },
    { unit: "minute" as const, seconds: 60 },
    { unit: "second" as const, seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.unit);
    }
  }

  return rtf.format(0, "second");
}

/**
 * 检查日期是否为今天
 * @param date - 要检查的日期
 * @returns 如果日期是今天则返回true
 */
export function isToday(date: Date | string | number): boolean {
  const dateObj = new Date(date);
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
}

/**
 * 向日期添加天数
 * @param date - 基础日期
 * @param days - 要添加的天数（可以为负数）
 * @returns 添加天数后的新日期
 */
export function addDays(date: Date | string | number, days: number): Date {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

/**
 * 获取给定日期的开始时间
 * @param date - 日期
 * @returns 设置为一天开始时间的日期（00:00:00.000）
 */
export function startOfDay(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * 获取给定日期的结束时间
 * @param date - 日期
 * @returns 设置为一天结束时间的日期（23:59:59.999）
 */
export function endOfDay(date: Date | string | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}
