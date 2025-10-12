/**
 * 使T的所有属性递归可选
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 使T的所有属性递归必需
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * 提取数组元素的类型
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * 为对象创建所有可能的点符号路径的联合
 */
export type DotNotation<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends object
    ? `${K}` | `${K}.${DotNotation<T[K]>}`
    : `${K}`
  : never;

/**
 * 获取点符号路径处的类型
 */
export type GetByPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? GetByPath<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * 函数参数的工具类型
 */
// biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用函数签名
export type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
  // biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用函数签名
) => any
  ? P
  : never;

/**
 * 函数返回类型的工具类型
 */
// biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用函数签名
export type ReturnType<T extends (...args: any) => any> = T extends (
  // biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用函数签名
  ...args: any
) => infer R
  ? R
  : // biome-ignore lint/suspicious/noExplicitAny: Utility type requires any for generic function signatures
    any;

/**
 * 创建仅包含T中指定键的类型
 */
export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/**
 * 创建不包含T中指定键的类型
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

/**
 * 使指定键可选
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 使指定键必需
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * 可空值的工具类型
 */
export type Nullable<T> = T | null;

/**
 * 可选值的工具类型
 */
export type Optional<T> = T | undefined;

/**
 * 可以为null或undefined的值的工具类型
 */
export type Maybe<T> = T | null | undefined;

/**
 * 创建用于类型安全的品牌类型
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * 异步函数返回类型的工具类型
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * 构造函数参数的工具类型
 */
// biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用构造函数签名
export type ConstructorParameters<T extends new (...args: any) => any> =
  // biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用构造函数签名
  T extends new (...args: infer P) => any ? P : never;

/**
 * 构造函数实例类型的工具类型
 */
// biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用构造函数签名
export type InstanceType<T extends new (...args: any) => any> = T extends new (
  // biome-ignore lint/suspicious/noExplicitAny: 工具类型需要any以获得通用构造函数签名
  ...args: any
) => infer R
  ? R
  : // biome-ignore lint/suspicious/noExplicitAny: Utility type requires any for generic constructor signatures
    any;

/**
 * 只读数组的工具类型
 */
export type ReadonlyArray<T> = readonly T[];

/**
 * 只读类型的可变版本的工具类型
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
