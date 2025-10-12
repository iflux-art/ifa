/**
 * 验证字符串是否为有效的电子邮件地址
 * @param email - 要验证的电子邮件字符串
 * @returns 如果是有效电子邮件则返回true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证字符串是否为有效的URL
 * @param url - 要验证的URL字符串
 * @returns 如果是有效URL则返回true
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证字符串是否仅包含字母数字字符
 * @param str - 要验证的字符串
 * @returns 如果是字母数字则返回true
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * 验证字符串是否为有效的电话号码（基本验证）
 * @param phone - 要验证的电话字符串
 * @returns 如果是有效电话格式则返回true
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
}

/**
 * 验证密码强度
 * @param password - 要验证的密码
 * @param options - 验证选项
 * @returns 包含分数和反馈的验证结果
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  const feedback: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length < minLength) {
    feedback.push(`密码长度至少为${minLength}个字符`);
  } else {
    score += 1;
  }

  // 大写检查
  if (requireUppercase && !/[A-Z]/.test(password)) {
    feedback.push("密码必须包含至少一个大写字母");
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // 小写检查
  if (requireLowercase && !/[a-z]/.test(password)) {
    feedback.push("密码必须包含至少一个小写字母");
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // 数字检查
  if (requireNumbers && !/\d/.test(password)) {
    feedback.push("密码必须包含至少一个数字");
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // 特殊字符检查
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push("密码必须包含至少一个特殊字符");
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }

  return {
    isValid: feedback.length === 0,
    score: Math.min(score, 5),
    feedback,
  };
}

/**
 * 验证值是否不为null、undefined或空字符串
 * @param value - 要验证的值
 * @returns 如果值存在则返回true
 */
export function isPresent<T>(value: T | null | undefined | ""): value is T {
  return value !== null && value !== undefined && value !== "";
}

/**
 * 验证字符串是否匹配特定模式
 * @param str - 要验证的字符串
 * @param pattern - 正则表达式模式
 * @returns 如果字符串匹配模式则返回true
 */
export function matchesPattern(str: string, pattern: RegExp): boolean {
  return pattern.test(str);
}

/**
 * 验证数字是否在指定范围内
 * @param num - 要验证的数字
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @returns 如果数字在范围内则返回true
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}
