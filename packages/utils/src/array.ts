/**
 * 根据键函数从数组中移除重复项
 * @param array - 要去重的数组
 * @param keyFn - 用于提取比较键的函数
 * @returns 移除重复项后的数组
 */
export function uniqueBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * 根据键函数对数组项进行分组
 * @param array - 要分组的数组
 * @param keyFn - 用于提取分组键的函数
 * @returns 包含分组项的对象
 */
export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );
}

/**
 * 将数组分割成指定大小的小数组
 * @param array - 要分割的数组
 * @param size - 每个块的大小
 * @returns 块数组
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("块大小必须为正数");
  }

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 安全地从数组中获取指定索引处的项
 * @param array - 要访问的数组
 * @param index - 要访问的索引
 * @returns 索引处的项或undefined
 */
export function safeArrayAccess<T>(array: T[], index: number): T | undefined {
  return index >= 0 && index < array.length ? array[index] : undefined;
}

/**
 * 在数组中将项从一个索引移动到另一个索引
 * @param array - 要修改的数组
 * @param fromIndex - 源索引
 * @param toIndex - 目标索引
 * @returns 项已移动的新数组
 */
export function moveArrayItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const newArray = [...array];
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
}
