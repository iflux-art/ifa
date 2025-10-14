/**
 * 通用验证工具函数
 *
 * 提供项目中使用的各种验证函数，包括URL验证、必填字段验证、数据格式验证等。
 *
 * @since 2025
 */

/**
 * 验证URL格式
 * @param urlString URL字符串
 * @returns 是否为有效的URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * 验证必填字段
 * @param data 数据对象
 * @param requiredFields 必填字段数组
 * @returns 缺失的字段数组
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    // 检查字段是否存在且不为空
    if (!data[field] || (typeof data[field] === "string" && !data[field]?.toString().trim())) {
      missingFields.push(field);
    }
  }

  return missingFields;
}

/**
 * 标准化URL
 * @param url URL字符串
 * @returns 标准化后的URL
 */
export function normalizeUrl(url: string): string {
  // 如果没有协议，添加 https://
  if (!(url.startsWith("http://") || url.startsWith("https://"))) {
    url = `https://${url}`;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    throw new Error("Invalid URL format");
  }
}

/**
 * 验证是否为有效的分类ID
 * @param category 分类ID
 * @param validCategories 有效的分类ID数组
 * @returns 是否为有效的分类ID
 */
export function isValidCategory<T extends readonly string[]>(
  category: string,
  validCategories: T
): category is T[number] {
  return validCategories.includes(category as T[number]);
}
