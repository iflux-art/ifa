/**
 * 将字符串的第一个字母大写
 * @param str - 要大写的字符串
 * @returns 大写字符串
 */
export function capitalize(str: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * 将字符串转换为驼峰命名法
 * @param str - 要转换的字符串
 * @returns 驼峰命名法字符串
 */
export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * 将字符串转换为短横线命名法
 * @param str - 要转换的字符串
 * @returns 短横线命名法字符串
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * 将字符串转换为蛇形命名法
 * @param str - 要转换的字符串
 * @returns 蛇形命名法字符串
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * 将字符串截断到指定长度并添加省略号
 * @param str - 要截断的字符串
 * @param length - 最大长度
 * @param suffix - 要添加的后缀（默认：'...'）
 * @returns 截断的字符串
 */
export function truncate(str: string, length: number, suffix = "..."): string {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 移除前导和尾随空格并规范化内部空格
 * @param str - 要规范化的字符串
 * @returns 规范化字符串
 */
export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, " ");
}

/**
 * 生成指定长度的随机字符串
 * @param length - 字符串长度
 * @param charset - 要使用的字符集（默认：字母数字）
 * @returns 随机字符串
 */
export function randomString(
  length: number,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 转义字符串中的HTML特殊字符
 * @param str - 要转义的字符串
 * @returns HTML转义字符串
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}

/**
 * 将字符串转换为标题大小写
 * @param str - 要转换的字符串
 * @returns 标题大小写字符串
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
