/**
 * Deep clone an object
 *
 * @param obj - Object to clone
 * @returns Deep cloned object
 *
 * @example
 * ```ts
 * const original = { a: 1, b: { c: 2 } }
 * const cloned = deepClone(original)
 * cloned.b.c = 3
 * console.log(original.b.c) // Still 2
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}

/**
 * Deep merge multiple objects
 *
 * @param target - Target object
 * @param sources - Source objects to merge
 * @returns Merged object
 *
 * @example
 * ```ts
 * const obj1 = { a: 1, b: { c: 2 } }
 * const obj2 = { b: { d: 3 }, e: 4 }
 * deepMerge(obj1, obj2) // Returns: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target

  const source = sources.shift()
  if (!source) return target

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        )
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Check if a value is a plain object
 *
 * @param obj - Value to check
 * @returns True if the value is a plain object
 */
function isObject<T>(obj: T): obj is T & Record<string, unknown> {
  return obj && typeof obj === 'object' && !Array.isArray(obj)
}

/**
 * Pick specific properties from an object
 *
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only the picked properties
 *
 * @example
 * ```ts
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' }
 * pick(user, ['id', 'name']) // Returns: { id: 1, name: 'John' }
 * ```
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Omit specific properties from an object
 *
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without the omitted properties
 *
 * @example
 * ```ts
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' }
 * omit(user, ['password']) // Returns: { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Get a nested property value using dot notation
 *
 * @param obj - Source object
 * @param path - Property path (e.g., 'user.profile.name')
 * @param defaultValue - Default value if property doesn't exist
 * @returns Property value or default value
 *
 * @example
 * ```ts
 * const data = { user: { profile: { name: 'John' } } }
 * get(data, 'user.profile.name') // Returns: 'John'
 * get(data, 'user.profile.age', 25) // Returns: 25
 * ```
 */
export function get<T = unknown>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T
): T {
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue as T
    }
    result = result[key] as Record<string, unknown>
  }

  return result === undefined ? (defaultValue as T) : (result as T)
}

/**
 * Set a nested property value using dot notation
 *
 * @param obj - Target object
 * @param path - Property path (e.g., 'user.profile.name')
 * @param value - Value to set
 * @returns The modified object
 *
 * @example
 * ```ts
 * const data = {}
 * set(data, 'user.profile.name', 'John')
 * // data is now { user: { profile: { name: 'John' } } }
 * ```
 */
export function set<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split('.')
  let current: Record<string, unknown> = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (
      !(key in current) ||
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return obj
}

/**
 * Check if an object has a nested property using dot notation
 *
 * @param obj - Source object
 * @param path - Property path (e.g., 'user.profile.name')
 * @returns True if the property exists
 *
 * @example
 * ```ts
 * const data = { user: { profile: { name: 'John' } } }
 * has(data, 'user.profile.name') // Returns: true
 * has(data, 'user.profile.age') // Returns: false
 * ```
 */
export function has(obj: Record<string, unknown>, path: string): boolean {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return false
    }
    current = current[key] as Record<string, unknown>
  }

  return true
}
