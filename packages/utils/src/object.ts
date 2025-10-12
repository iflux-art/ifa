/**
 * 深度克隆对象
 * @param obj - 要克隆的对象
 * @returns 深度克隆的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (typeof obj === "object") {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * 深度合并两个对象
 * @param target - 目标对象
 * @param source - 源对象
 * @returns 合并后的对象
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型对象类型需要any
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * 使用点符号从对象中获取嵌套属性值
 * @param obj - 要搜索的对象
 * @param path - 点符号路径（例如，'user.profile.name'）
 * @param defaultValue - 路径未找到时的默认值
 * @returns 路径处的值或默认值
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型工具函数需要any以获得灵活性
export function get<T = any>(
  // biome-ignore lint/suspicious/noExplicitAny: 对象参数需要any以进行通用访问
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T {
  const keys = path.split(".");
  // biome-ignore lint/suspicious/noExplicitAny: Traversal variable needs any for dynamic access
  let result: any = obj;

  for (const key of keys) {
    if (result == null || typeof result !== "object") {
      return defaultValue as T;
    }
    result = result[key];
  }

  return result !== undefined ? result : (defaultValue as T);
}

/**
 * 使用点符号在对象中设置嵌套属性值
 * @param obj - 要修改的对象
 * @param path - 点符号路径
 * @param value - 要设置的值
 * @returns 修改后的对象
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型对象类型需要any
export function set<T extends Record<string, any>>(
  obj: T,
  path: string,
  // biome-ignore lint/suspicious/noExplicitAny: 值参数需要any以获得灵活性
  value: any
): T {
  const keys = path.split(".");
  const lastKey = keys.pop();
  if (!lastKey) {
    return obj;
  }
  // biome-ignore lint/suspicious/noExplicitAny: 遍历变量需要any以进行动态访问
  let current: any = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
}

/**
 * 从对象中省略指定的键
 * @param obj - 源对象
 * @param keys - 要省略的键
 * @returns 不包含指定键的新对象
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型对象工具需要any以获得灵活性
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * 从对象中选择指定的键
 * @param obj - 源对象
 * @param keys - 要选择的键
 * @returns 仅包含指定键的新对象
 */
// biome-ignore lint/suspicious/noExplicitAny: 泛型对象工具需要any以获得灵活性
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
